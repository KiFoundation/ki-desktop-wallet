// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
const APP_DIR = path.resolve(__dirname, '../../../release-builds/Ki Desktop Wallet-win32-ia32');
const OUT_DIR = path.resolve(__dirname, '../output/windows');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configure metadata
    description: 'The KiChain Desktop Wallet',
    exe: 'Ki Desktop Wallet',
    name: 'Ki Desktop Wallet',
    manufacturer: 'Ki Foundation',
    version: '0.1.0',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true,
        images:{
          background : path.resolve(__dirname, "./banner.png")
        }
    },
});

// 4. Create a .wxs template file
msiCreator.create().then(function(){

    // Step 5: Compile the template to a .msi file
    msiCreator.compile();
});