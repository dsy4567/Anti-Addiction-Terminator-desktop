const { app, BrowserWindow, MessageChannelMain, shell } = require("electron");
const path = require("path");

/**
 * @type {Electron.CrossProcessExports.BrowserWindow}
 */
var 主窗口;
var 服务器已启动 = 0;

function 创建窗口() {
    主窗口 = new BrowserWindow({
        width: 1024,
        height: 768,
        autoHideMenuBar: true,
        title: "防沉迷终结者",
        icon: path.join(__dirname, "../view/icon/128.png"),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "./preload.js"),
        },
    });

    主窗口.loadFile("./view/index.html").then(() => {
        主窗口.webContents.openDevTools();
    });
}

app.on("ready", () => {
    创建窗口();

    const { port1, port2 } = new MessageChannelMain();
    port2.postMessage("hello");
    port2.on("message", (事件) => {
        console.log(事件.data);

        if (事件.data === "hi") {
            return;
        }

        if (事件.data.操作 === "启动服务器" && !服务器已启动) {
            const { readFileSync } = require("node:fs");

            try {
                readFileSync(path.join(__dirname, "../ssl/rootCA.crt"));
                readFileSync(path.join(__dirname, "../ssl/rootCA.key"));
                readFileSync(path.join(__dirname, "../ssl/rootCA.srl"));
            } catch (e) {
                port2.postMessage({ 操作: "启动服务器失败", 参数: [] });
                shell.openPath(path.join(__dirname, "../ssl/fix-up-all.bat"));
                return;
            }
            try {
                readFileSync(path.join(__dirname, "../ssl/server.crt"));
                readFileSync(path.join(__dirname, "../ssl/server.csr"));
                readFileSync(path.join(__dirname, "../ssl/server.key"));
            } catch (e) {
                port2.postMessage({ 操作: "启动服务器失败", 参数: [] });
                shell.openPath(path.join(__dirname, "../ssl/fix-up.bat"));
                return;
            }

            require("./server");
            服务器已启动 = 1;
            port2.postMessage({ 操作: "启动服务器完成", 参数: [] });
        }
    });
    port2.start();
    主窗口.webContents.postMessage("hello", null, [port1]);
});

app.on("window-all-closed", () => {
    app.quit();
});
