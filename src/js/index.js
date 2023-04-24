window.$ = window.jQuery = require('jquery');

const { ipcRenderer } = require('electron');
config = JSON.parse(ipcRenderer.sendSync('synchronous-message', ''));

console.log("App Name: " + config.name);
console.log("App Title: " + config.title);
console.log("App Version: " + config.version);
console.log('Node.js Version: ' + process.version);
console.log('Chromium Version: ' + process.versions['chrome'] );
console.log('Electron Version: ' + process.versions.electron);

jQuery(".title").html(config.title);