#!/bin/sh

# GitHub Desktop keeps its OAuth credential behind a loopback helper whose
# port changes whenever the app restarts. Resolve that port at call time so
# unattended local publishing can use the signed-in Desktop session without
# copying a token into this repository or an environment file.
desktop_port="$(
  lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null |
    awk '$1 == "GitHub" && $9 ~ /^127\.0\.0\.1:/ { sub(/^.*:/, "", $9); print $9; exit }'
)"

if [ -z "$desktop_port" ]; then
  echo "GitHub Desktop must be running for authenticated pushes." >&2
  exit 1
fi

DESKTOP_PORT="$desktop_port" exec \
  "/Applications/GitHub Desktop.app/Contents/Resources/app/git/libexec/git-core/git-credential-desktop" "$@"
