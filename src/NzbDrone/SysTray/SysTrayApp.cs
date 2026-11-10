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

        private EventWaitHandle _showSignal;
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
            _trayMenu.Items.Add(new ToolStripMenuItem("Open in Browser", null, (_, _) => OpenBrowser()));
            _trayMenu.Items.Add(new ToolStripMenuItem("Use Midgar on my NAS instead…", null, (_, _) => SwitchToNas()));
            _trayMenu.Items.Add(new ToolStripSeparator());
            _trayMenu.Items.Add(new ToolStripMenuItem("Exit", null, OnExit));

            _trayIcon.Text = string.Format("Midgar - {0}", BuildInfo.Version);
            _trayIcon.Icon = Properties.Resources.Sonarr;

            _trayIcon.ContextMenuStrip = _trayMenu;
            _trayIcon.Visible = true;
            _trayIcon.DoubleClick += (_, _) => ShowAppWindow();

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
