import { app, BrowserWindow } from "electron";
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

  // Load React frontend port??
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function createCharacterWindow() {
  characterWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
  });

  //character.html path
  characterWindow.loadFile(path.join(__dirname, "character.html"));
  // false = clickable
  characterWindow.setSkipTaskbar(true);
  characterWindow.setIgnoreMouseEvents(false); 
}

app.whenReady().then(() => {
  createMainWindow();
  createCharacterWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createMainWindow();
});
