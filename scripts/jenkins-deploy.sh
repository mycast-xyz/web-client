#!/usr/bin/env bash
set -euo pipefail
test -n "${JENKINS_HOME:-}"
test "${WORKSPACE:?}" = "$PWD"
node -e 'if (+process.versions.node.split(".")[0] < 22) throw Error("Node.js 22 or newer is required")'
npm install
npm run build
# Do not expose the new attachment UI before the backend is ready.
node --input-type=module -e '
const response = await fetch("http://127.0.0.1:9010/video/policy", {signal:AbortSignal.timeout(10000)});
const policy = await response.json();
if (!response.ok || !(policy.maxBytes > 0)) throw Error("Deploy the video API first");'
target=/var/www/html/home2
test -d "$target"
backup="$JENKINS_HOME/mycast-backups/web-${BUILD_NUMBER:?}"
mkdir -p "$backup"
cp -p "$target/index.html" "$backup/index.html"
# Preserve old hashed assets for users who already have the previous page open.
cp -R ./.svelte-kit/output/client/. "$target/"
cp -R ./.svelte-kit/output/prerendered/pages/. "$target/"
echo 'Web deployment completed by Jenkins.'
