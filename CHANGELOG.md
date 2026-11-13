# Midgar changes

Each release's notes come from its section here, and show on System > Updates.
Lines starting with "Fixed" are listed under Fixed.

## 1.9

- Fixed the login page asking for an @ in the username; any username works.

## 1.8

- Fixed sign-in and General settings refusing to save (a leftover Sonarr rule wanted the instance name to contain "Sonarr").
- The sign-in window says why a save failed.

## 1.7

- Fixed the Synology package failing to install ("Failed to install the package"). It asked DSM for a port setting it couldn't find.

## 1.6

- Windows: the folder picker can see network folders. Type `\\name-of-your-NAS\` to list its shared folders; network folders you've mapped or opened in File Explorer are listed with your drives.

## 1.5

- Fixed the old icon still showing in the top-left corner of the window after an update.

## 1.4

- Updates page (System > Updates): shows your version and the newest one with what changed, and installs it from inside Midgar. On Synology it downloads the new package.
- Getting-started checklist on an empty library: TV folder, Lifestream, indexers, first show.
- Sign-in setup is one step: a login that isn't asked for on your own PC or home network, and the window doesn't come back after saving.
- Settings show a Save bar when something has changed.
- Bigger toolbar buttons. A show's page keeps Search, Refresh and Edit up front and puts the rest under More.
- Box of X: readable queue count, BACK steps from a show to the series list before going home, a MODE button on the home screen, a compact top row on phones, the current page always has a tab, and a gentler glow on the orb.
- FFVII menu: the info window holds the counts and the status line says how Midgar is doing; "Time" explains itself on hover.
- General settings: networking is under Show Advanced; "Open Midgar on start" replaces "Open browser on start".
- Midgar no longer asks Sonarr's servers for updates, notices or the time, and System > Status links to Midgar's own pages.
- The Windows updater checks the installer against the checksum GitHub publishes before running it.
- Synology: uninstalling now warns that settings are removed and says how to keep a backup; a folder that Midgar can't write to says how to give it access.
- Log files are named midgar.txt.
- Fixed the FFVII menu covering the page on phones.
