using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Threading;
using System.Windows.Forms;

namespace NzbDrone.SysTray
{
    // Midgar: "NAS mode". When a server address is saved, Midgar.exe skips its own
    // background service and just shows the Midgar running on the NAS in its window.
    public static class RemoteViewer
    {
        private const string ShowSignalName = @"Local\Midgar.ShowNasWindow";

        private static string SettingFile => Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Midgar",
            "nas-address.txt");

        public static Uri SavedServer()
        {
            try
            {
                if (File.Exists(SettingFile))
                {
                    return Normalize(File.ReadAllText(SettingFile));
                }
            }
            catch (Exception)
            {
                // Unreadable setting: run normally.
            }

            return null;
        }

        public static void Save(Uri server)
        {
            Directory.CreateDirectory(Path.GetDirectoryName(SettingFile));
            File.WriteAllText(SettingFile, server.ToString());
        }

        public static void Clear()
        {
            if (File.Exists(SettingFile))
            {
                File.Delete(SettingFile);
            }
        }

        public static Uri Normalize(string text)
        {
            var value = (text ?? string.Empty).Trim();

            if (value.Length == 0)
            {
                return null;
            }

            if (!value.Contains("://"))
            {
                value = "http://" + value;
            }

            if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) ||
                (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            {
                return null;
            }

            // A bare host gets Midgar's default port.
            if (uri.IsDefaultPort && !value.Substring(value.IndexOf("://", StringComparison.Ordinal) + 3).Contains(':'))
            {
                uri = new UriBuilder(uri) { Port = 8990 }.Uri;
            }

            if (!uri.AbsolutePath.EndsWith('/'))
            {
                uri = new UriBuilder(uri) { Path = uri.AbsolutePath + "/" }.Uri;
            }

            return uri;
        }

        // Asks for the NAS address. Returns null if cancelled.
        public static Uri Ask(Icon icon, Uri current)
        {
            using var form = new Form
            {
                Text = "Use Midgar on your NAS",
                Icon = icon,
                FormBorderStyle = FormBorderStyle.FixedDialog,
                StartPosition = FormStartPosition.CenterScreen,
                MaximizeBox = false,
                MinimizeBox = false,
                AutoScaleMode = AutoScaleMode.Dpi,
                ClientSize = new Size(440, 150)
            };

            var label = new Label
            {
                Text = "Address of the Midgar on your Synology (for example 192.168.1.20 or nas.local:8990):",
                Location = new Point(12, 12),
                Size = new Size(416, 36)
            };

            var input = new TextBox
            {
                Text = current?.ToString() ?? string.Empty,
                Location = new Point(12, 54),
                Size = new Size(416, 24)
            };

            var ok = new Button { Text = "Connect", DialogResult = DialogResult.OK, Location = new Point(262, 104), Size = new Size(80, 30) };
            var cancel = new Button { Text = "Cancel", DialogResult = DialogResult.Cancel, Location = new Point(348, 104), Size = new Size(80, 30) };

            form.Controls.AddRange(new Control[] { label, input, ok, cancel });
            form.AcceptButton = ok;
            form.CancelButton = cancel;

            while (form.ShowDialog() == DialogResult.OK)
            {
                var uri = Normalize(input.Text);

                if (uri != null)
                {
                    return uri;
                }

                MessageBox.Show(form, "That doesn't look like an address. Try something like 192.168.1.20:8990.", "Midgar", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            return null;
        }

        public static void Restart(string args)
        {
            Process.Start(new ProcessStartInfo(Application.ExecutablePath, args) { UseShellExecute = false });
        }

        // NAS mode: just the window and a tray icon, no local service.
        public static void Run(Uri server)
        {
            // One NAS window at a time: a second launch just brings the first one forward.
            using var signal = new EventWaitHandle(false, EventResetMode.AutoReset, ShowSignalName, out var createdNew);

            if (!createdNew)
            {
                signal.Set();
                return;
            }

            var icon = Properties.Resources.Sonarr;

            using var tray = new NotifyIcon { Icon = icon, Text = "Midgar (NAS)", Visible = true };
            using var menu = new ContextMenuStrip();

            AppWindow window = null;

            void Show()
            {
                if (window == null || window.IsDisposed)
                {
                    window = new AppWindow(server, icon, _ =>
                    {
                        Process.Start(new ProcessStartInfo(server.ToString()) { UseShellExecute = true });
                    });
                    window.Show();
                    return;
                }

                window.ShowAndFocus(false);
            }

            void Exit()
            {
                if (window != null && !window.IsDisposed)
                {
                    window.AllowClose = true;
                    window.Close();
                }

                tray.Visible = false;
                Application.Exit();
            }

            var open = new ToolStripMenuItem("Open Midgar", null, (_, _) => Show());
            open.Font = new Font(open.Font, FontStyle.Bold);

            menu.Items.Add(open);
            menu.Items.Add(new ToolStripMenuItem("Change NAS address…", null, (_, _) =>
            {
                var next = Ask(icon, server);

                if (next != null)
                {
                    Save(next);
                    Restart(string.Empty);
                    Exit();
                }
            }));
            menu.Items.Add(new ToolStripMenuItem("Run Midgar on this PC instead", null, (_, _) =>
            {
                Clear();
                Restart(string.Empty);
                Exit();
            }));
            menu.Items.Add(new ToolStripSeparator());
            menu.Items.Add(new ToolStripMenuItem("Exit", null, (_, _) => Exit()));

            tray.ContextMenuStrip = menu;
            tray.DoubleClick += (_, _) => Show();

            Show();

            var ui = SynchronizationContext.Current ?? new WindowsFormsSynchronizationContext();
            var listener = new Thread(() =>
            {
                while (signal.WaitOne())
                {
                    ui.Post(_ => Show(), null);
                }
            })
            {
                IsBackground = true
            };

            listener.Start();
            Application.Run();
        }
    }
}
