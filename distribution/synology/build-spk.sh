#!/bin/sh
# Assemble Midgar-<version>-x86_64.spk from a linux-x64 Midgar build.
# Usage: distribution/synology/build-spk.sh <app folder> <version> [outdir]
#   <app folder>  folder holding the Midgar binary, its DLLs and the UI folder
set -eu
APP="$1"
VERSION="$2"
OUT="${3:-_artifacts}"
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# package.tgz: the app and the DSM menu entry
mkdir -p "$WORK/pkg/app" "$WORK/pkg/ui"
cp -R "$APP/." "$WORK/pkg/app/"
rm -rf "$WORK/pkg/app/Sonarr.Update"
chmod 755 "$WORK/pkg/app/Midgar"
find "$WORK/pkg/app" -name ffprobe -exec chmod 755 {} \;
cp -R "$HERE/ui/." "$WORK/pkg/ui/"
(cd "$WORK/pkg" && tar --owner=0 --group=0 -czf "$WORK/package.tgz" app ui)

# spk layout
mkdir -p "$WORK/spk"
sed "s/@VERSION@/$VERSION/" "$HERE/INFO.in" > "$WORK/spk/INFO"
echo "extractsize=\"$(du -sk "$WORK/pkg" | cut -f1)\"" >> "$WORK/spk/INFO"
cp "$WORK/package.tgz" "$WORK/spk/"
cp -R "$HERE/scripts" "$HERE/conf" "$WORK/spk/"
cp "$HERE/PACKAGE_ICON.PNG" "$HERE/PACKAGE_ICON_256.PNG" "$WORK/spk/"
chmod 755 "$WORK/spk/scripts/"*

mkdir -p "$OUT"
OUT="$(cd "$OUT" && pwd)"
NAME="Midgar-$VERSION-x86_64.spk"
(cd "$WORK/spk" && tar --owner=0 --group=0 -cf "$OUT/$NAME" INFO package.tgz scripts conf PACKAGE_ICON.PNG PACKAGE_ICON_256.PNG)
echo "$OUT/$NAME"
