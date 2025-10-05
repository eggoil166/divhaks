"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow = null;
let characterWindow = null;
/** Wait-and-retry helper so Electron doesn’t open before Vite is ready */
async function loadReactDev(win, url) {
    for (let i = 0; i < 20; i++) {
        try {
            await win.loadURL(url);
            console.log(" Loaded React dev server at", url);
            return;
        }
        catch {
            console.log("Waiting for Vite dev server...");
            await new Promise((r) => setTimeout(r, 500));
        }
    }
    console.error("Could not reach React dev server:", url);
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
        },
    });
    if (process.env.NODE_ENV === "development") {
        // match your Vite dev port
        const devServerUrl = "http://localhost:3000";
        loadReactDev(mainWindow, devServerUrl);
    }
    else {
        // point to built Vite output (dist folder at project root)
        const prodIndex = path_1.default.join(__dirname, "../../dist/index.html");
        mainWindow.loadFile(prodIndex);
    }
}
function createCharacterWindow() {
    characterWindow = new electron_1.BrowserWindow({
        width: 200,
        height: 200,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        hasShadow: false,
    });
    characterWindow.loadFile(path_1.default.join(__dirname, "character.html"));
    characterWindow.setSkipTaskbar(true);
    characterWindow.setIgnoreMouseEvents(false);
}
electron_1.app.whenReady().then(() => {
    createMainWindow();
    createCharacterWindow();
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", () => {
    if (mainWindow === null)
        createMainWindow();
});
