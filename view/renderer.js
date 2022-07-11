var 端口;

window.onmessage = (事件) => {
    console.log("window.onmessage:", 事件);

    if (事件.source === window && 事件.data === "hello") {
        const [_端口] = 事件.ports;

        _端口.onmessage = (事件) => {
            console.log("_端口.onmessage:", 事件);

            if (事件.data === "hello") {
                端口 = _端口;
                _端口.postMessage("hi");
                return;
            }

            const 操作 = 事件.data.操作;
            // eslint-disable-next-line no-unused-vars
            const 参数 = 事件.data.参数;

            if (操作 === "启动服务器完成") {
                alert("启动服务器完成");
            } else if (操作 === "启动服务器失败") {
                alert("启动服务器失败");
            }
        };
    }
};

// ----------

function 给主进程发消息(操作, 参数) {
    if (端口) {
        端口.postMessage({ 操作: 操作, 参数: 参数 });
    }
}

document.querySelector("#hhh").addEventListener("click", () => {
    给主进程发消息("启动服务器", []);
});
