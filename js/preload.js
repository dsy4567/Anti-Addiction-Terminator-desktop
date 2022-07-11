/* global window */

const { ipcRenderer } = require("electron");

const 已加载 = new Promise((resolve) => {
    window.onload = resolve;
});

ipcRenderer.on("hello", async (事件) => {
    await 已加载;
    // We use regular window.postMessage to transfer the port from the isolated
    // world to the main world.
    window.postMessage("hello", "*", 事件.ports);
});
