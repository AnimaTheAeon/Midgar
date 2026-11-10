using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Extensions.Hosting;
using NLog;
using NzbDrone.Common.EnvironmentInfo;
using NzbDrone.Common.Instrumentation;
using NzbDrone.Common.Processes;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Lifecycle;
using NzbDrone.Host;

namespace NzbDrone.SysTray
{
    // Midgar: tray icon plus the app window. The hidden form is only the message pump.
    public class SystemTrayApp : Form, IHostedService
    {
        private static readonly Logger Logger = NzbDroneLogger.GetLogger(typeof(SystemTrayApp));

        private readonly ILifecycleService _lifecycle;
        private readonly IConfigFileProvider _configFileProvider;
        private readonly IProcessProvider _processProvider;

        private readonly NotifyIcon _trayIcon = new NotifyIcon();
        private readonly ContextMenuStrip _trayMenu = new ContextMenuStrip();

        private readonly System.Windows.Forms.Timer _updateTimer = new System.Windows.Forms.Timer();
        private readonly ToolStripMenuItem _updateItem = new ToolStripMenuItem { Visible = false };

        private EventWaitHandle _showSignal;
        private AvailableUpdate _update;
        private Version _announced;
        private bool _installing;
        private AppWindow _window;
        private bool _toldAboutTray;
        private bool _useBrowser;

        public SystemTrayApp(ILifecycleService lifecycle, IConfigFileProvider configFileProvider, IProcessProvider processProvider)
        {
            _lifecycle = lifecycle;
            _configFileProvider = configFileProvider;
            _processProvider = processProvider;
        }

        public void Start()
        {
            var open = new ToolStripMenuItem("Open Midgar", null, (_, _) => ShowAppWindow());
            open.Font = new System.Drawing.Font(open.Font, System.Drawing.FontStyle.Bold);

            _trayMenu.Items.Add(open);
            _updateItem.Font = new System.Drawing.Font(open.Font, System.Drawing.FontStyle.Bold);
            _updateItem.Click += (_, _) => InstallUpdate();
            _trayMenu.Items.Add(_updateItem);
            _trayMenu.Items.Add(new ToolStripMenuItem("Open in Browser", null, (_, _) => OpenBrowser()));
            _trayMenu.Items.Add(new ToolStripMenuItem("Use Midgar on my NAS instead…", null, (_, _) => SwitchToNas()));
            _trayMenu.Items.Add(new ToolStripMenuItem("Check for updates", null, async (_, _) => await CheckForUpdates(true)));
            _trayMenu.Items.Add(new ToolStripSeparator());
            _trayMenu.Items.Add(new ToolStripMenuItem("Exit", null, OnExit));

            _trayIcon.Text = string.Format("Midgar - {0}", BuildInfo.Version);
            _trayIcon.Icon = Properties.Resources.Sonarr;

            _trayIcon.ContextMenuStrip = _trayMenu;
            _trayIcon.Visible = true;
            _trayIcon.DoubleClick += (_, _) => ShowAppWindow();
            _trayIcon.BalloonTipClicked += (_, _) =>
            {
                if (_update != null && _announced == _update.Version)
                {
                    InstallUpdate();
                }
            };

            // First check a minute after start, then every 6 hours.
            _updateTimer.Interval = 60 * 1000;
            _updateTimer.Tick += async (_, _) =>
            {
                _updateTimer.Interval = 6 * 60 * 60 * 1000;
                await CheckForUpdates(false);
            };
            _updateTimer.Start();

            Application.Run(this);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            // Created before the web host starts, so the startup "open the UI" call finds it.
            _showSignal = new EventWaitHandle(false, EventResetMode.AutoReset, AppWindowSignal.Name);

            var thread = new Thread(Start);
            thread.SetApartmentState(ApartmentState.STA);
            thread.Start();

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (_window != null && !_window.IsDisposed)
            {
                _window.AllowClose = true;
                _window.Close();
            }

            DisposeTrayIcon();
        }

        protected override void OnLoad(EventArgs e)
        {
            Visible = false;
            ShowInTaskbar = false;

            base.OnLoad(e);

            // Anything that wants the UI (startup, a second launch) sets the signal.
            var listener = new Thread(ListenForShowRequests) { IsBackground = true, Name = "Midgar window signal" };
            listener.Start();
        }

        protected override void Dispose(bool isDisposing)
        {
            if (isDisposing)
            {
                _updateTimer.Dispose();
                _trayIcon.Dispose();
                _showSignal?.Dispose();
            }

            if (InvokeRequired)
            {
                Invoke(new MethodInvoker(() => Dispose(isDisposing)));
            }
            else
            {
                base.Dispose(isDisposing);
            }
        }

        private Uri HomeUri()
        {
            var urlBase = _configFileProvider.UrlBase;

            return new Uri(string.Format("http://localhost:{0}{1}/", _configFileProvider.Port, urlBase));
        }

        private void ListenForShowRequests()
        {
            while (true)
            {
                try
                {
                    _showSignal.WaitOne();

                    if (IsDisposed || Disposing)
                    {
                        return;
                    }

                    BeginInvoke(new MethodInvoker(ShowAppWindow));
                }
                catch (ObjectDisposedException)
                {
                    return;
                }
                catch (InvalidOperationException)
                {
                    return;
                }
            }
        }

        private void ShowAppWindow()
        {
            if (_useBrowser)
            {
                OpenBrowser();
                return;
            }

            if (_window == null || _window.IsDisposed)
            {
                _window = new AppWindow(HomeUri(), Properties.Resources.Sonarr, OnWindowUnavailable);
                _window.VisibleChanged += OnWindowVisibleChanged;
                _window.Show();
                return;
            }

            _window.ShowAndFocus(false);
        }

        private void OnWindowVisibleChanged(object sender, EventArgs e)
        {
            if (_window == null || _window.Visible || _toldAboutTray || _window.AllowClose)
            {
                return;
            }

            _toldAboutTray = true;
            _trayIcon.ShowBalloonTip(4000, "Midgar is still running", "It keeps watching your shows from the tray. Right-click the icon to exit.", ToolTipIcon.Info);
        }

        private void OnWindowUnavailable(string message)
        {
            _useBrowser = true;
            _trayIcon.ShowBalloonTip(6000, "Midgar", message, ToolTipIcon.Warning);
            OpenBrowser();
        }

        private void OpenBrowser()
        {
            try
            {
                _processProvider.OpenDefaultBrowser(HomeUri().ToString());
            }
            catch (Exception ex)
            {
                Logger.Warn(ex, "Couldn't open the browser");
            }
        }

        private async Task CheckForUpdates(bool manual)
        {
            var update = await AppUpdater.CheckAsync();

            if (update == null)
            {
                if (manual)
                {
                    _trayIcon.ShowBalloonTip(4000, "Midgar", $"You're on the latest version ({BuildInfo.Version}).", ToolTipIcon.Info);
                }

                return;
            }

            _update = update;
            _updateItem.Text = $"Install update {update.Version}";
            _updateItem.Visible = true;

            if (manual || _announced != update.Version)
            {
                _announced = update.Version;
                _trayIcon.ShowBalloonTip(8000, $"Midgar {update.Version} is ready", "Click here (or Install update in the tray menu) to update. Midgar restarts by itself.", ToolTipIcon.Info);
            }
        }

        private async void InstallUpdate()
        {
            if (_update == null || _installing)
            {
                return;
            }

            _installing = true;
            _updateItem.Text = "Downloading update…";
            _updateItem.Enabled = false;

            try
            {
                await AppUpdater.StartInstallAsync(_update);
                _lifecycle.Shutdown();
            }
            catch (Exception ex)
            {
                Logger.Warn(ex, "Update failed");
                _installing = false;
                _updateItem.Text = $"Install update {_update.Version}";
                _updateItem.Enabled = true;
                _trayIcon.ShowBalloonTip(6000, "Midgar", "The update couldn't be downloaded. Try again later, or get it from the Releases page.", ToolTipIcon.Warning);
            }
        }

        private void SwitchToNas()
        {
            var server = RemoteViewer.Ask(Properties.Resources.Sonarr, null);

            if (server == null)
            {
                return;
            }

            // Stop the service on this PC and come back as a window onto the NAS.
            RemoteViewer.Save(server);
            RemoteViewer.Restart(string.Empty);
            _lifecycle.Shutdown();
        }

        private void OnExit(object sender, EventArgs e)
        {
            _lifecycle.Shutdown();
        }

        private void DisposeTrayIcon()
        {
            if (_trayIcon == null)
            {
                return;
            }

            _trayIcon.Visible = false;
            _trayIcon.Icon = null;
            _trayIcon.Visible = false;
            _trayIcon.Dispose();
        }
    }
}
