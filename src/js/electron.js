/**** START - INIT *****/

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const fs = require('fs');

/**** END - INIT *****/


/**** START - VARS *****/

var devtoolsOn = true;

/**** END - INIT *****/


/**** START - FUNCTIONS *****/

function readConf() {
    const data = fs.readFileSync(__dirname + '/../../package.json', 'utf8');
    return data;
}

function createWindow() {
    // INIT
    const window = new BrowserWindow({
        transparent: true,
        width: 800,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname + '/../../src/images/icon/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    window.loadFile("src/index.html");

    // EVENT LISTENERS

    ipcMain.on('update-title', (event, title) => {
        window.setTitle(title);
    }); 
    
    ipcMain.on('synchronous-message', (event, arg) => {
        event.returnValue = readConf();
    });

    window.webContents.on("did-finish-load", () => {
        
        if(devtoolsOn) {
            let devtools = new BrowserWindow()
            window.webContents.setDevToolsWebContents(devtools.webContents)
            window.webContents.openDevTools({ mode: 'detach' })
            devtools.hide();
            devtools.removeMenu();
            const electron = require('electron');
            var screenElectron = electron.screen;
            var mainScreen = screenElectron.getPrimaryDisplay();
            var dimensions = mainScreen.size;
            var devtoolsWidth = 800;
            var devtoolsPosition = dimensions.width - devtoolsWidth;
            devtools.setSize(devtoolsWidth, dimensions.height);
            devtools.setPosition(devtoolsPosition, 0);
            devtools.show();
        }

        window.show();
        window.focus();
        
    });

    window.on("close", () => {
        mainWindow = null;
        app.quit();
     });

    app.on("window-all-closed", function () {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

}


/**** END - FUNCTIONS *****/


/**** START - APP READY *****/

app.whenReady().then(() => {
    createWindow();
});

/**** END - APP READY *****/