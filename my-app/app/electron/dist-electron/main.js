"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
let mainWindow;
let characterWindow;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, "preload.js"),
        },
    });
    // Load React frontend port??
    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:5173");
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, "../dist/index.html"));
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
    //character.html path
    characterWindow.loadFile(path_1.default.join(__dirname, "character.html"));
    // false = clickable
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
