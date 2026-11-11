; Midgar installer (Inno Setup). Built by .github/workflows/build.yml.

#define AppName "Midgar"
#define AppPublisher "AnimaTheAeon"
#define AppURL "https://github.com/AnimaTheAeon/Midgar"
#define AppExeName "Midgar.exe"
#define BuildNumber GetEnv('MIDGAR_VERSION')
#define Framework GetEnv('FRAMEWORK')
#define Runtime GetEnv('RUNTIME')

[Setup]
AppId={{092C9D4A-3B01-4A7A-89A4-84A9297C7402}
AppName={#AppName}
AppVersion={#BuildNumber}
AppPublisher={#AppPublisher}
AppPublisherURL={#AppURL}
AppSupportURL={#AppURL}
AppUpdatesURL={#AppURL}/releases
UsePreviousAppDir=no
DefaultDirName={commonappdata}\Midgar\bin
DisableDirPage=yes
DefaultGroupName={#AppName}
DisableProgramGroupPage=yes
OutputBaseFilename=Midgar-{#BuildNumber}-{#Runtime}-setup
SolidCompression=yes
AppCopyright=GPL-3.0 (based on Sonarr)
LicenseFile=..\..\..\LICENSE.md
AllowUNCPath=False
UninstallDisplayIcon={app}\{#AppExeName}
DisableReadyPage=True
CompressionThreads=2
Compression=lzma2/normal
VersionInfoVersion={#BuildNumber}
SetupLogging=yes
OutputDir="..\..\..\_artifacts"
AppVerName={#AppName} {#BuildNumber}
WizardStyle=modern
WizardImageFile=wizard-large.bmp
WizardSmallImageFile=wizard-small.bmp
SetupIconFile=..\..\..\src\NzbDrone.Host\Sonarr.ico
CloseApplications=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopIcon"; Description: "{cm:CreateDesktopIcon}"
Name: "startupShortcut"; Description: "Start Midgar in the tray when I log into Windows"; GroupDescription: "Start automatically"; Flags: exclusive
Name: "none"; Description: "Do not start automatically"; GroupDescription: "Start automatically"; Flags: exclusive unchecked

[Files]
Source: "..\..\..\_artifacts\{#Runtime}\{#Framework}\Midgar\{#AppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "..\..\..\_artifacts\{#Runtime}\{#Framework}\Midgar\*"; Excludes: "Sonarr.Update"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#AppName}"; Filename: "{app}\{#AppExeName}"
Name: "{commondesktop}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Tasks: desktopIcon
; From the Startup folder it opens quietly in the tray (/nobrowser = don't show the window).
Name: "{userstartup}\{#AppName}"; Filename: "{app}\{#AppExeName}"; Parameters: "/nobrowser"; WorkingDir: "{app}"; Tasks: startupShortcut

[InstallDelete]
Name: "{app}"; Type: filesandordirs

[Run]
Filename: "{app}\Midgar.Console.exe"; Description: "Let phones and other PCs on my network open Midgar"; StatusMsg: "Allowing network access"; Parameters: "/registerurl /exitimmediately"; Flags: postinstall unchecked runascurrentuser runhidden waituntilterminated
Filename: "{app}\{#AppExeName}"; Description: "Start Midgar"; Flags: postinstall skipifsilent nowait
; After a quiet update from the tray, start Midgar again.
Filename: "{app}\{#AppExeName}"; Flags: nowait skipifnotsilent runasoriginaluser

[Code]
function InitializeSetup(): Boolean;
var
  Version: String;
begin
  Result := True;
  { The window uses the Microsoft Edge WebView2 Runtime (built into Windows 11). }
  if not RegQueryStringValue(HKLM, 'SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}', 'pv', Version) and
     not RegQueryStringValue(HKCU, 'Software\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}', 'pv', Version) then
  begin
    SuppressibleMsgBox('Midgar shows its window with the Microsoft Edge WebView2 Runtime, which this PC doesn''t seem to have.' + #13#10#13#10 +
           'Midgar will still install and open in your browser. To get the app window, install the WebView2 Runtime from Microsoft (search "WebView2 Runtime download").',
           mbInformation, MB_OK, IDOK);
  end;
end;
