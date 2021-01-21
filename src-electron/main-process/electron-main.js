import { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, globalShortcut } from 'electron'
import fs from 'fs'
import path from 'path'

const { createPlaylistWindow } = require('./Windows/playlistWindow')
const { createPlayerOptionWindow } = require('./Windows/playerOptionWindow')
const mediainfo = require('node-mediainfo')
const apiServer = require('./webApi')
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
let playOptions

//Main window
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreenWindowTitle: true,
    webPreferences: {
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,
      enableRemoteModule: true,
      // webSecurity: false
    }
  })
  mainWindow.loadURL(process.env.APP_URL)
  mainWindow.setAspectRatio(16/9)
  mainWindow.on('closed', () => {
    app.quit()
  })
  mainWindow.setBackgroundColor('#352D2C')
  mainWindow.setAspectRatio(16/9)
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
    mainWindow = createWindow()
  }
})

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      { label: 'Open', accelerator: 'CommandOrControl+O', click () { open() } },
      { label: 'Develop', accelerator: 'CommandOrControl+I', click () { mainWindow.webContents.toggleDevTools() } },
      { label: 'Exit', accelerator: 'ctrl+F4', click () { app.quit() } }
    ]
  },
  {
    label: 'Player',
    submenu: [
      {
        label: 'Play Options',
        accelerator: 'CommandOrControl+D',
        click () {
          createPlayerOptionWindow()
        }
      },
      { type: 'separator' },
      { label: 'Full Screen', accelerator: 'F11', click () { fullscreen() } },
      { 
        label: 'Playlist',
        accelerator: 'CommandOrControl+L',
        click () {
          playlistWindow = createPlaylistWindow()
          console.log(playlistWindow)
        }
      }
    ]
  }
])

Menu.setApplicationMenu(menu)

//db
const dbPath = `${app.getPath('userData')}/.db/playlist.db`
console.log(dbPath)
const db = Datastore.create({
  filename: dbPath,
  timestampData: true,
  autoload: true
})
global.db = db

//data Communication
ipcMain.on('play', async (event, idx) => {
  const file = await db.find({ index: idx })
  if (fs.existsSync(file[0].path)) {
    sendFile(file[0].path, true)
  } else {
    mainWindow.webContents.send('error', '파일이 존재 하지 않습니다.')
  }
})

ipcMain.on('end', (event, msg) => {
  console.log('end', msg)
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
//open file function

function open () {
  const file = dialog.showOpenDialogSync({
    filters: [
      { name: 'Audio & Video', extensions: ['mp4', "mkv", 'mov', 'avi', 'webm', 'mp3', 'wav', 'ogg'] },
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
  mainWindow.webContents.send('info', '111')
  console.log('send')
  mainWindow.webContents.send('file', file, play)
}

function getMediaInfo(file) {
  // const currentMediainfo = await mediainfo(file)
  // const filePath = path.parse(file)
  // console.log(currentMediainfo.media.track[0])
  console.log('send')
  mainWindow.webContents.send('info', '111')
}

//fullscreen function
function fullscreen () {
  const isFullScreen = mainWindow.isFullScreen()
    mainWindow.setFullScreen(!isFullScreen)
    mainWindow.setMenuBarVisibility(isFullScreen)
}


//api server start
apiServer.listen(8082)