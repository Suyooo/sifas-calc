#!/usr/bin/env sh

echo "Event and Notification Info..."
uglifyjs -m -c -o build/js/networkinfo.js js/networkinfo.js
echo "WW Banner..."
pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text image/event_en.png build/image/event_en.png
echo "JP Banner..."
pngcrush -s -rem gAMA -rem cHRM -rem iCCP -rem sRGB -rem alla -rem text image/event_jp.png build/image/event_jp.png

echo "Done."