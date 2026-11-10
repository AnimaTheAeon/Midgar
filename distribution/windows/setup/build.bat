@REM Local installer build. Needs Inno Setup 6 and a packaged build in _artifacts.
@REM SET MIDGAR_MAJOR_VERSION=5
@REM SET MIDGAR_VERSION=5.29.0.1
@REM SET FRAMEWORK=net10.0
@REM SET RUNTIME=win-x64

"%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" midgar.iss
