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
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  characterWindow = new BrowserWindow({
    width: 200,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    focusable: false,
    x: width - 250,
    y: height - 250,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  characterWindow.loadFile(path.join(__dirname, "character.html"));
  // Click-through optional:
  // characterWindow.setIgnoreMouseEvents(true, { forward: true });
}

app.whenReady().then(() => {
  createMainWindow();

  // Delay slightly so React UI loads first, then cat appears
  setTimeout(createCharacterWindow, 3000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
