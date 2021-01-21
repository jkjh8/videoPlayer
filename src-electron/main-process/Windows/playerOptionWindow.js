const { BrowserWindow } = require('electron')

let playerOptionWindow
exports.createPlayerOptionWindow = () => {
  if (!playerOptionWindow) {
    playerOptionWindow = new BrowserWindow({
      width: 600,
      height: 400,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
        nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
        enableRemoteModule: true
        // webSecurity: false
      }
    })
    playerOptionWindow.loadURL(process.env.APP_URL+'/#/playoption')
    playerOptionWindow.on('closed', () => { playerOptionWindow = null })
    // playerOptionWindow.removeMenu()
  } else {
    playerOptionWindow.setVisibleOnAllWorkspaces(true)
    playerOptionWindow.show()
  }
  return playerOptionWindow
}
