#!/usr/bin/env sh

echo "Event and Notification Info..."
uglifyjs -m -c -o build/js/networkinfo.js js/networkinfo.js
echo "WW Banner..."
cp image/event_en.jpg build/image/event_en.jpg
echo "JP Banner..."
cp image/event_jp.jpg build/image/event_jp.jpg

echo "Done."