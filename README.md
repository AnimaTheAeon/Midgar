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

To download with [Lifestream](https://github.com/AnimaTheAeon/Lifestream), go to
Settings → Download Clients → **+** and pick **Lifestream**. Enter the PC or
NAS address, port 9091, and the username and password set in Lifestream.

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

## Updates

Midgar checks this repo's Releases for new versions. Versions are numbered
1.1, 1.2, and so on: publish a release tagged `v1.2` and the build attaches
the installer and `.spk` to it. (Behind the scenes Midgar still reports a
Sonarr 4.x version to other tools so Prowlarr and Materia accept it.)

- **Windows:** the tray icon pops up when an update is ready; click it (or
  **Install update** in the tray menu) and Midgar downloads the installer,
  updates itself and starts again. **Check for updates** is in the tray menu too.
- **Synology:** an **UPDATE … READY** button appears in the status line. It
  downloads the new `.spk`; install it with Package Center → Manual Install.
  Your settings and library are kept. (DSM doesn't let packages replace
  themselves, so this step stays manual.)

## Building

GitHub Actions (`.github/workflows/build.yml`) builds everything on each push:
the web UI, the Windows zip and installer, and the Synology package. Pushing a
`v*` tag publishes a release.

Local frontend work: `yarn install`, then `yarn build` (or `yarn start`).

## License

GPL-3.0, same as Sonarr. See [LICENSE.md](LICENSE.md) and [COPYRIGHT.md](COPYRIGHT.md).
Nunito font: SIL Open Font License (`frontend/src/Content/Fonts/Nunito-OFL.txt`).
