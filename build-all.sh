# Build the application
$(cd app/ ; npm install; sh build.sh)

# Package the application in electron
npm install

# macos
npm run package-mac

# windows
npm run package-win

# linux
npm run package-linux

# Build the releases
# macos
npm run build-installer-mac

# windows
npm run build-installer-win

# linux
npm run build-installer-linux