import { app, BrowserWindow, screen } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null;
let characterWindow: BrowserWindow | null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function createCharacterWindow() {
  const { width, height, x, y } = screen.getPrimaryDisplay().bounds;

  characterWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    focusable: false, 
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  characterWindow.setBounds({ x, y, width, height });
  characterWindow.setAlwaysOnTop(true, "screen-saver");

  characterWindow.setIgnoreMouseEvents(true, { forward: true });
  characterWindow.loadFile(path.join(__dirname, "character.html"));
}

app.whenReady().then(() => {
  createMainWindow();
  setTimeout(createCharacterWindow, 3000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
