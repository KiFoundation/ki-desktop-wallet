# Build the application
$(cd app/ ; npm install; sh build.sh)

# Package the application in electron
npm install

# macos
npm run package-mac

# macos M1
npm run package-mac-arm

# windows
npm run package-win

# linux
npm run package-linux

# Build the releases
# macos
npm run build-installer-mac
# npm run build-installer-mac-arm

# linux
npm run build-installer-linux
