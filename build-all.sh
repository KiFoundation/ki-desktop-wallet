# dependencies
#   - wine
#   - Mono
#   - dmgbuild

# Build the application
$(cd app/ ; sh build.sh)

# Package the application in electron
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