# Midgar changes

Each release's notes come from its section here, and show on System > Updates.
Lines starting with "Fixed" are listed under Fixed.

## 1.23

- On a Synology, System > Updates now has an Install button: Midgar downloads the new version, checks it and restarts by itself, like the other apps. No more downloading the package and installing it in Package Center.

## 1.22

- System > Updates downloads the new package through Midgar itself, and its messages no longer mention where updates come from.
- System > Status no longer lists web links for Midgar's home page, releases or problem reports.
- The Windows installer and Package Center no longer show developer or support web links; the developer is shown as Midgar.
- The Updates page no longer points to a commit history.

## 1.21

- New look: Liquid Glass. Dark frosted glass over soft color, capsule buttons and fields, switches instead of check boxes, and a menu pill that glides to the page you open. Dialogs and menus spring in. Pick it in Settings → UI → Theme. The other three looks are unchanged.
- The sign-in page has a Liquid Glass version too.

## 1.20

- The sign-in page now matches the look picked in Settings → UI: FFVII Menu, Xbox or Blades.

## 1.19

- Fixed Midgar not coming back after a Restart inside the app (the Restart button, restoring a backup, changing the port) on a Synology. It now restarts itself.
- Midgar no longer loads Sonarr's usage-tracking and error-report scripts in the browser, and nothing is sent to anyone's servers. The switch is gone because it can't be turned on.

## 1.18

- Fixed Check for updates not seeing a brand-new release for up to an hour. Midgar now asks GitHub again after two minutes.

## 1.17

- Fixed Blades pop-up windows having square corners poking out past their rounded frame.
- Fixed dropdown lists in the Blades look being see-through, so the text behind them showed through and was hard to read. They now have a solid background, with a clear highlight for the option under your cursor and the one that's selected.

## 1.16

- Midgar on a Synology now updates itself, like Materia: Install on the Updates page downloads the new version, swaps it in and restarts, with a progress bar in every theme. No more installing the .spk by hand. (This version has to be installed by hand once; every one after it updates itself.)

## 1.15

- Fixed checkboxes not showing whether they were on or off in the Xbox and Blades looks (and hard to read in the FFVII look). An empty box is now dark with a clear outline, and a checked one fills in with a dark tick.

## 1.14

- New start screen: the plate with its slow rings and eight reactors, in the FFVII menu, Xbox and Blades looks. It replaces the old loading logo and jokes.

## 1.13

- Fixed rows near the top and bottom of a Blades page getting cut off at the right edge (a toolbar button could run past the blade).

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
