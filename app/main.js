const electron = require('electron')
const app = electron.app
//const fs = require('fs')
const path = require('path')
const Tray = electron.Tray
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const nativeImage = electron.nativeImage




let win
let popwin

app.on('ready', () => {
  //加载主窗口
  createWindow()
  //任务栏
  createTray()
  //加载弹出窗口
  createPopWindow()
})


//主窗口
function createWindow() {

  if (!win) {
    win = new BrowserWindow({ width: 980, height: 600, frame: true, resizable: true, icon: path.join(__dirname, '', 'assets/images/icon.png') })
    //win.webContents.openDevTools()
    win.loadURL(`file://${__dirname}/index.html`)
    
    win.on('minimize', () => {
      win.hide()
    })

    win.on('closed', () => {
      app.quit()
    })
  }
}

//任务栏
function createTray() {
  //let image = nativeImage.createFromPath(path.join(__dirname, 'img', 'src/images/icon.png'))
  tray = new Tray(path.join(__dirname, '', 'assets/images/icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '消息',
      //icon:nativeImage.createFromPath('assets/images/pnotify/warning.png'),
      click(item, focusedWindow) {
        createPopWindow()
      }
    }, {
      label: '设置',
      //icon:nativeImage.createFromPath('assets/images/pnotify/warning.png'),
      click(item, focusedWindow) {
        createWindow()
        win.loadURL(`file://${__dirname}/settings.html`)
      }
    }, {
      label: '退出',

      click(item, focusedWindow) {
        app.quit()
      }
    }
  ])

  tray.setToolTip('智能消息提醒软件 by xiaov.cn@163.com')

  tray.setContextMenu(contextMenu)
  //单击任务栏图标动作
  tray.on('double-click', () => {
    win.isVisible() ? win.hide() : win.show()
  })
  win.on('show', () => {
    tray.setHighlightMode('always')
  })
  win.on('hide', () => {
    tray.setHighlightMode('never')
  })
}

//弹出窗口
function createPopWindow() {

  //计算用户屏幕大小  
  let screenSize = electron.screen.getPrimaryDisplay().workAreaSize
  
  popwin = new BrowserWindow({
    x: screenSize.width - 300, y: screenSize.height - 86,
    width: 300,
    height: 100,    
    frame: false,
    icon: path.join(__dirname, '', 'assets/images/icon.png'),
    transparent: true,
    alwaysOnTop: true,
    movable: true,
    skipTaskbar: true //不在任务栏显示
  })
  popwin.loadURL(`file://${__dirname}/popwin.html`)
}

