import { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, globalShortcut } from 'electron'
const AspectRatioBrowserWindow = require('electron-aspect-ratio-browser-window')
import fs from 'fs'
import path from 'path'

require('./webApi')

const Datastore = require('nedb-promises')

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
// let audioDevices
let playlistWindow

//Main window
function createWindow () {
  mainWindow = new AspectRatioBrowserWindow({
    width: 1600,
    height: 900,
    fullscreenWindowTitle: true,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION
      // webSecurity: false
    }
  })
  mainWindow.loadURL(process.env.APP_URL)
  mainWindow.on('closed', () => {
    app.quit()
  })
  mainWindow.setBackgroundColor('#352D2C')
  mainWindow.setAspectRatio(16/9)
}

//playlist window
function createPlaylistWindow () {
  playlistWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION
      // webSecurity: false
    }
  })
  playlistWindow.loadURL(process.env.APP_URL+'/#/playlist')
  playlistWindow.on('closed', () => { playlistWindow = null })
  playlistWindow.removeMenu()
}

app.on('ready', createWindow)

// Global Short cut
app.whenReady().then(() => {
  globalShortcut.register('esc', () => {
    mainWindow.setFullScreen(false)
    mainWindow.setMenuBarVisibility(true)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globalShortcut.unregisterAll()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

//open file function
function open () {
  const file = dialog.showOpenDialogSync({
    filters: [
      { name: 'Audio & Video', extensions: ['mp4', 'mov', 'avi', 'webm', 'mp3', 'wav', 'ogg'] },
      { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'webm'] },
      { name: 'Audios', extensions: ['mp3', 'wav', 'ogg'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  })
  console.log(file)
  if (file && file.length > 0) {
    sendFile(file[0])
  }
}

function sendFile (file, play = false) {
  mainWindow.webContents.send('file', file, play)
}

//fullscreen function
function fullscreen () {
  const isFullScreen = mainWindow.isFullScreen()
    mainWindow.setFullScreen(!isFullScreen)
    mainWindow.setMenuBarVisibility(isFullScreen)
}

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      { label: 'Open', accelerator: 'ctrl+o', click () { open() } },
      { label: 'Develop', accelerator: 'ctrl+d', click () { mainWindow.webContents.toggleDevTools() } },
      { label: 'Exit', accelerator: 'ctrl+F4', click () { app.quit() } }
    ]
  },
  {
    label: 'Player',
    submenu: [
      { label: 'Full Screen', accelerator: 'f11', click () { fullscreen() } },
      { label: 'Playlist', accelerator: 'ctrl+l', click () { createPlaylistWindow() } }
    ]
  }
])

Menu.setApplicationMenu(menu)

//db


const dbPath = `${process.cwd()}/playlist.db`
const db = Datastore.create({
  filename: dbPath,
  timestampData: true,
  autoload: true
})
global.db = db

//data Communication
ipcMain.on('play', async (event, idx) => {
  const file = await db.find({ index: idx })
  console.log(file)
  sendFile(file[0].path, true)
})




// ipcMain.on('audioDevices', (event, devices) => {
//   console.log(devices)
//   audioDevices = devices.filter(device => device.kind === 'audiooutput')
//   console.log(audioDevices)
// })

//return logo
// ipcMain.on('reqLogo', (e) => {
//   const logoFile = fs.readFileSync('C:/Users/jkjh8/OneDrive/Desktop/dev/playerElectron/src-electron/main-process/img/logo.png')
//   e.reply('reqLogo', logoFile)
// })