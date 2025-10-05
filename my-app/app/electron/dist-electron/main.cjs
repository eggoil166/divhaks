"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { app, BrowserWindow, screen } = require("electron");
const path_1 = __importDefault(require("path"));

let mainWindow = null;
let characterWindow = null;

// wait for vite dev server to start
async function loadReactDev(win, url) {
  for (let i = 0; i < 20; i++) {
    try {
      await win.loadURL(url);
      console.log("✅ Loaded React dev server at", url);
      return;
    } catch {
      console.log("Waiting for Vite dev server...");
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.error("Could not reach React dev server:", url);
}

// react window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path_1.default.join(__dirname, "preload.js"),
    },
  });

  const devServerUrl = "http://localhost:3000";

  if (process.env.NODE_ENV === "development") {
    loadReactDev(mainWindow, devServerUrl);
  } else {
    const prodIndex = path_1.default.join(__dirname, "../../dist/index.html");
    mainWindow.loadFile(prodIndex);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function createCharacterWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  characterWindow = new BrowserWindow({
    width,
    height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    focusable: false,
  });

  characterWindow.loadFile(path_1.default.join(__dirname, "character.html"));
  characterWindow.setSkipTaskbar(true);

  characterWindow.setIgnoreMouseEvents(true, { forward: true });

  // optional
  characterWindow.setAlwaysOnTop(true, "screen-saver");
}

app.whenReady().then(() => {
  createMainWindow();

  // small delay to ensure frontend loads first
  setTimeout(() => {
    createCharacterWindow();
  }, 800);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createMainWindow();
});
