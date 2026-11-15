#!/bin/sh
# Runs Midgar on Synology and applies its self-updates.
# Usage: midgar-run.sh <package var folder> <package folder>
#
# When Midgar finds a new release it unpacks it into $UPD/next and stops.
# This script then moves it to $UPD/current and starts it. If an update dies
# within 30 seconds it is moved to $UPD/failed and the version that came with
# the installed .spk runs instead. Installing an .spk by hand clears $UPD.
VAR="$1"
DEST="$2"
UPD="$VAR/app-update"
child=""
stopping=0

trap 'stopping=1; [ -n "$child" ] && kill -TERM "$child" 2>/dev/null' TERM INT

while :; do
	if [ -d "$UPD/next" ]; then
		rm -rf "$UPD/previous"
		[ -d "$UPD/current" ] && mv "$UPD/current" "$UPD/previous"
		mv "$UPD/next" "$UPD/current"
		echo "$(date) midgar-run: switched to the downloaded update"
	fi

	APP="$DEST"
	[ -x "$UPD/current/app/Midgar" ] && APP="$UPD/current"

	started=$(date +%s)
	# exec makes the subshell become Midgar, so $! is Midgar's own pid.
	(cd "$APP/app" && MIDGAR_SPK_UPDATE_DIR="$UPD" exec "$APP/app/Midgar" -nobrowser -data="$VAR") &
	child=$!
	echo "$child" > "$VAR/midgar-app.pid"
	# wait returns early when a signal arrives; keep waiting until it has exited.
	rc=0
	while kill -0 "$child" 2>/dev/null; do
		wait "$child"
		rc=$?
	done
	child=""
	rm -f "$VAR/midgar-app.pid"

	[ "$stopping" = 1 ] && exit 0
	# An update is ready: loop round and start it.
	[ -d "$UPD/next" ] && continue

	if [ "$APP" != "$DEST" ] && [ $(( $(date +%s) - started )) -lt 30 ]; then
		echo "$(date) midgar-run: the update stopped within 30 s; going back to the installed version"
		rm -rf "$UPD/failed"
		mv "$UPD/current" "$UPD/failed"
		continue
	fi

	# Midgar stopped by itself (Shutdown in its menu).
	exit "$rc"
done
