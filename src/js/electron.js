var devtoolsOn = true;

const { app, BrowserWindow, ipcMain } = require('electron');
var path = require('path')

const fs = require('fs');

function readConf() {
    const data = fs.readFileSync(__dirname + '/../../package.json', 'utf8');
    return data;
}

ipcMain.on('synchronous-message', (event, arg) => {
    event.returnValue = readConf();
  })

function createWindow() {
    // Create a new window
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname + '/../../src/images/icon/512x512.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
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

    window.loadFile("src/index.html");

}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});