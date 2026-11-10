# Midgar

Midgar watches your TV series and grabs new episodes automatically, with a
classic JRPG party-menu look. It's a fork of [Sonarr](https://github.com/Sonarr/Sonarr)
built on Sonarr's stable v4 release line (`main` branch), that runs as a Windows app (its own window and tray icon, no browser needed) or
as a Synology package. Sibling app to
[Jenova](https://github.com/AnimaTheAeon/Jenova) (subtitles) and
[Lifestream](https://github.com/AnimaTheAeon/Lifestream) (torrents).

## What's different from Sonarr

- **Look:** blue gradient windows, white frames, Nunito menu text and the
  pointing-hand cursor, matching Jenova and Lifestream.
- **Layout:** the menu sits on the right with an info window under it
  (status, uptime, queue, missing episodes, free space) and a status line
  along the bottom.
- **Party view:** the default series view lists your shows like party members:
  poster portrait, LV (seasons), next episode, and an EP gauge for episodes on disk.
- **Simple / Advanced:** the MODE button hides the settings pages most people
  never touch (custom formats, import lists, connections, metadata, tags, UI,
  events, logs). Advanced shows everything.
- **A real app on Windows:** `Midgar.exe` opens its own window (Microsoft Edge
  WebView2). Closing it keeps Midgar running in the tray; right-click the tray
  icon to exit.
- **NAS mode:** right-click the tray icon, pick *Use Midgar on my NAS instead*,
  and enter the NAS address. The PC then only shows the Midgar running on the
  Synology.
- **Separate from Sonarr:** its own name, data folder (`%ProgramData%\Midgar`),
  port (**8990**) and process names, so it can sit next to a real Sonarr.
  Sonarr's built-in updater and crash reporting are turned off.

## Install

Midgar also works as a download client target for
[Lifestream](https://github.com/AnimaTheAeon/Lifestream): add a **Transmission**
download client pointing at Lifestream's host and RPC port.

Grab the latest build from [Releases](https://github.com/AnimaTheAeon/Midgar/releases)
or from the newest run under Actions.

- **Windows:** `Midgar-<version>-win-x64-setup.exe`. Needs the Microsoft Edge
  WebView2 Runtime for the app window (built into Windows 11); without it
  Midgar opens in your browser instead.
- **Synology (DSM 7):** `Midgar-<version>-x86_64.spk`. In Package Center choose
  *Manual Install*. Afterwards give the **Midgar** system user Read/Write on
  your TV and download shared folders (Control Panel > Shared Folder > Edit >
  Permissions > System internal user). Midgar is then on port 8990 and in the
  DSM main menu.

Point Jenova at your series folder and it will fetch subtitles for whatever
Midgar imports.

## Building

GitHub Actions (`.github/workflows/build.yml`) builds everything on each push:
the web UI, the Windows zip and installer, and the Synology package. Pushing a
`v*` tag publishes a release.

Local frontend work: `yarn install`, then `yarn build` (or `yarn start`).

## License

GPL-3.0, same as Sonarr. See [LICENSE.md](LICENSE.md) and [COPYRIGHT.md](COPYRIGHT.md).
Nunito font: SIL Open Font License (`frontend/src/Content/Fonts/Nunito-OFL.txt`).
