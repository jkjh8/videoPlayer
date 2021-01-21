const { BrowserWindow } = require('electron')

let playlistWindow
exports.createPlaylistWindow = () => {
  if (!playlistWindow) {
    playlistWindow = new BrowserWindow({
      width: 900,
      height: 400,
      useContentSize: true,
      webPreferences: {
        nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
        nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
        enableRemoteModule: true
        // webSecurity: false
      }
    })
    playlistWindow.loadURL(process.env.APP_URL+'/#/playlist')
    playlistWindow.on('closed', () => { playlistWindow = null })
    playlistWindow.removeMenu()
  } else {
    playlistWindow.setVisibleOnAllWorkspaces(true)
    playlistWindow.show()
  }
  return playlistWindow
}
