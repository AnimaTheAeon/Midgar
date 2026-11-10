using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;
using NLog;
using NzbDrone.Common.Instrumentation;

namespace NzbDrone.SysTray
{
    // Midgar's main window: the FFVII-styled UI inside an Edge WebView2 control,
    // so it runs as its own app instead of a browser tab. Closing it hides it to the tray.
    public class AppWindow : Form
    {
        private static readonly Logger Logger = NzbDroneLogger.GetLogger(typeof(AppWindow));
        private static readonly Color Backdrop = Color.FromArgb(4, 4, 12);

        private readonly Uri _home;
        private readonly Action<string> _onUnavailable;
        private readonly WebView2 _webView;

        public AppWindow(Uri home, Icon icon, Action<string> onUnavailable)
        {
            _home = home;
            _onUnavailable = onUnavailable;

            Text = "Midgar";
            Icon = icon;
            BackColor = Backdrop;
            StartPosition = FormStartPosition.CenterScreen;
            AutoScaleMode = AutoScaleMode.Dpi;
            ClientSize = new Size(1280, 820);
            MinimumSize = new Size(960, 640);

            _webView = new WebView2
            {
                Dock = DockStyle.Fill,
                DefaultBackgroundColor = Backdrop
            };

            Controls.Add(_webView);
            Load += OnWindowLoad;
        }

        public bool AllowClose { get; set; }

        public void ShowAndFocus(bool reload)
        {
            if (!Visible)
            {
                Show();
            }

            if (WindowState == FormWindowState.Minimized)
            {
                WindowState = FormWindowState.Normal;
            }

            Activate();

            if (reload && _webView.CoreWebView2 != null)
            {
                _webView.CoreWebView2.Navigate(_home.ToString());
            }
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (!AllowClose && e.CloseReason == CloseReason.UserClosing)
            {
                // Keep running in the tray; shows keep being watched.
                e.Cancel = true;
                Hide();
                return;
            }

            base.OnFormClosing(e);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _webView.Dispose();
            }

            base.Dispose(disposing);
        }

        private static void OpenExternally(string uri)
        {
            try
            {
                Process.Start(new ProcessStartInfo(uri) { UseShellExecute = true });
            }
            catch (Exception ex)
            {
                Logger.Warn(ex, "Couldn't open {0}", uri);
            }
        }

        private bool IsAppAddress(string uri)
        {
            if (!Uri.TryCreate(uri, UriKind.Absolute, out var parsed))
            {
                return true;
            }

            // Only web pages on other sites leave the window; blob:, data: and the like stay.
            if (parsed.Scheme != Uri.UriSchemeHttp && parsed.Scheme != Uri.UriSchemeHttps)
            {
                return true;
            }

            return parsed.Scheme == _home.Scheme &&
                   string.Equals(parsed.Host, _home.Host, StringComparison.OrdinalIgnoreCase) &&
                   parsed.Port == _home.Port;
        }

        private async void OnWindowLoad(object sender, EventArgs e)
        {
            try
            {
                // Keep the browser profile with the rest of Midgar's data, not next to the exe.
                var dataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Midgar", "WebView2");
                var environment = await CoreWebView2Environment.CreateAsync(null, dataFolder);

                await _webView.EnsureCoreWebView2Async(environment);

                var core = _webView.CoreWebView2;

                core.Settings.IsStatusBarEnabled = false;
                core.Settings.IsZoomControlEnabled = true;
                core.Settings.AreDevToolsEnabled = false;

                // Links to TheTVDB, IMDb, wikis and so on open in the normal browser.
                core.NewWindowRequested += (_, args) =>
                {
                    args.Handled = true;
                    OpenExternally(args.Uri);
                };

                core.NavigationStarting += (_, args) =>
                {
                    if (!IsAppAddress(args.Uri))
                    {
                        args.Cancel = true;
                        OpenExternally(args.Uri);
                    }
                };

                core.DocumentTitleChanged += (_, _) =>
                {
                    Text = string.IsNullOrWhiteSpace(core.DocumentTitle) ? "Midgar" : core.DocumentTitle;
                };

                core.Navigate(_home.ToString());
            }
            catch (WebView2RuntimeNotFoundException ex)
            {
                Logger.Warn(ex, "Microsoft Edge WebView2 Runtime isn't installed");
                Unavailable("Midgar needs the Microsoft Edge WebView2 Runtime to show its window. Opening it in your browser instead.");
            }
            catch (Exception ex)
            {
                Logger.Error(ex, "Couldn't start the Midgar window");
                Unavailable("Midgar couldn't open its window. Opening it in your browser instead.");
            }
        }

        private void Unavailable(string message)
        {
            AllowClose = true;
            Close();
            _onUnavailable(message);
        }
    }
}
