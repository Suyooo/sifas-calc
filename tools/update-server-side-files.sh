#!/usr/bin/env sh

echo "Event and Notification Info..."
uglifyjs -m -c -o build/js/networkinfo.js js/networkinfo.js
echo "Banner..."
cp image/event.jpg build/image/event_jp.jpg

echo "Done."