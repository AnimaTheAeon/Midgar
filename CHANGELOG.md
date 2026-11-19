# Midgar changes

Each release's notes come from its section here, and show on System > Updates.
Lines starting with "Fixed" are listed under Fixed.

## 1.34

- Midgar works on a phone. Open it in your phone's browser (at home, or through a private connection to your home network), then use Share > Add to Home Screen: it opens full-screen as "Midgar" with its own icon.
- On a phone, Queue, Missing and the episode search show one card per item instead of a wide table: each download with its progress bar, state, size and time left; each missing episode with its search buttons; each release with its quality, size, seeders, age and a big grab button, plus the reasons it was turned down written out.
- On a phone the toolbar scrolls sideways instead of cutting buttons off, long show names get two lines, and the Add Series window fits the screen.
- Blades on a phone: the closed blades shrink to thin slivers so the page gets the screen, and a row of section buttons along the bottom switches blades. Swiping works on every page.
- MC360 on a phone: the blades become a strip of tabs across the top (tap or swipe), with big menu rows cut from the skin's own highlight, the status card, the guide, and pages using the full width. The Y, X, B and A buttons sit along the bottom.
- FFVII Menu, Xbox and Dark Glass keep their look with the same phone improvements.
- Fixed: swiping between blades could trigger the browser's swipe-to-go-back.

## 1.33

- Fixed: in MC360, pointing at a blade or a menu entry could fill it with a solid blue block, and the menu text came out heavy and bold. The look no longer picks up the app's own button and text styles.
- Fixed: on a page, MC360 now keeps the open blade fully on screen at the left, with the page beside it and the other blades showing at the right, instead of cutting the blade off at the window's edge.

## 1.32

- Fixed: after an update the browser could keep using the previous version's MC360 files (they're kept for a long time), so fixes to the look didn't show until a hard refresh. The look's files now load fresh with each new version.

## 1.31

- MC360 now always opens on the menu of the blade you're on (switching looks used to drop you straight onto the page, with the blades parted off the screen until you clicked the blade's edge). It also fits tall or narrow windows: it scales to the window's width as well as its height and centres itself, and it re-checks the size whenever it draws.
- Fixed: in MC360 the series search's results were see-through, so the toolbar showed through them. They now sit on a solid pane above the page.
- Fixed: in Blades and MC360, pop-up windows (such as an episode's History) had square insides poking past their rounded corners, language tags were near-white with white text, and the Keyboard Shortcuts keys were blank white boxes.

## 1.30

- New look: MC360. The blades from the MC360 dashboard skin, one per menu section (Series, Calendar, Activity, Wanted, Settings, System), each with its own menu of pages. Pick one and the page opens on the blade, with every button and setting it has in the other looks. Left and Right change blades, Up and Down move, Enter opens, Esc goes back. Three skins (Default, Glass, Carbon), the skin's sounds with a volume control, and Calmer motion for a still background. Press G or the Y button for the guide: look, skin, sounds, updates and sign out. Pick it in Settings > UI.
- The sign-in page has an MC360 version too.

## 1.29

- Fixed: a download that Midgar gave up on because it got no data for 30 minutes stayed in Lifestream. With Remove Failed on (the default), Midgar now removes it there too.

## 1.28

- The Liquid Glass look is now called Dark Glass. Nothing else changes: if you were using it, you still are.

## 1.27

- A download that gets no data at all for 30 minutes in Lifestream (nobody is sharing it) is now marked failed: Midgar blocks that release and searches for another one. Lifestream only counts while the download is really running and the network works, so a pause, a queue or a VPN or internet outage never counts. Needs Lifestream 1.3.20.
- A blocked release is also recognized when it comes back from a different site (same title, same size), so the same dead release isn't grabbed again.

## 1.26

- Fixed: after an update the page could switch to a "Failed to load" screen while Midgar restarted, instead of reloading by itself into the new version. Once the page has loaded, a moment without Midgar no longer replaces it.

## 1.25

- Fixed: Install could sit at "Starting the download, 2%" forever when the update stopped before downloading (for example when the update server didn't answer). The page now says the update didn't start, and why.
- Fixed: an update waited until every other task had finished (a series refresh or RSS sync can take many minutes). It now starts right away; if it ever has to wait, the page says what it's waiting for.
- Install uses the update list the page loaded earlier if the update server doesn't answer again.
- Downloads no longer give up after 5 minutes on a slow connection. A download that stops getting data for 90 seconds is stopped, with a plain message.
- Update error messages never show the address of the update server.

## 1.24

- Xbox theme: every page now has the page bar along the bottom, one tab per page, next to Back. It is hidden on the home screen.
- Xbox theme: opening a page from the orb now fades through a dark green veil instead of a bright lime flash.
- Fixed: messages from the server (for example on the health bar) said "Sonarr" instead of "Midgar".
- Windows: if the Midgar desktop app isn't running when you press Install, Midgar now asks you to open it and press Install again, instead of offering a download.

## 1.23

- On a Synology, System > Updates now has an Install button: Midgar downloads the new version, checks it and restarts by itself, like the other apps. No more downloading the package and installing it in Package Center.

## 1.22

- System > Updates downloads the new package through Midgar itself, and its messages no longer mention where updates come from.
- System > Status no longer lists web links for Midgar's home page, releases or problem reports.
- The Windows installer and Package Center no longer show developer or support web links; the developer is shown as Midgar.
- The Updates page no longer points to a commit history.

## 1.21

- New look: Dark Glass. Dark frosted glass over soft color, capsule buttons and fields, switches instead of check boxes, and a menu pill that glides to the page you open. Dialogs and menus spring in. Pick it in Settings → UI → Theme. The other three looks are unchanged.
- The sign-in page has a Dark Glass version too.

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
- Xbox: readable queue count, BACK steps from a show to the series list before going home, a MODE button on the home screen, a compact top row on phones, the current page always has a tab, and a gentler glow on the orb.
- FFVII menu: the info window holds the counts and the status line says how Midgar is doing; "Time" explains itself on hover.
- General settings: networking is under Show Advanced; "Open Midgar on start" replaces "Open browser on start".
- Midgar no longer asks Sonarr's servers for updates, notices or the time, and System > Status links to Midgar's own pages.
- The Windows updater checks the installer against the checksum GitHub publishes before running it.
- Synology: uninstalling now warns that settings are removed and says how to keep a backup; a folder that Midgar can't write to says how to give it access.
- Log files are named midgar.txt.
- Fixed the FFVII menu covering the page on phones.
