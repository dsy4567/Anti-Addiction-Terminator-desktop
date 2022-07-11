module.exports = {
    遇到错误:
        /**
         * @param {Error} 错误
         */
        (错误) => {
            // console.log("hhh");
            console.error(错误);
        },
};
try {
    console.log("服务器启动中");
    const https = require("node:https");
    const fs = require("node:fs");
    const http = require("http");
    const { Resolver } = require("node:dns");
    const Dns解析器 = new Resolver();

    Dns解析器.setServers([
        // 114 DNS
        "114.114.114.114",
        "114.114.115.115",
        // 阿里 DNS
        "223.5.5.5",
        "223.6.6.6",
        // Google DNS
        "8.8.8.8",
        "8.8.4.4",
        // 微软 DNS
        "4.2.2.1",
        "4.2.2.2",
    ]);
    const 选项 = {
        key: fs.readFileSync("ssl/server.key"),
        cert: fs.readFileSync("ssl/server.crt"),
    };

    // vvvvvvvvvv 在这里注册破解规则 vvvvvvvvvv
    const 破解规则 = {
        "www.4399.com": { 名字: "4399小游戏", 处理: require("../rule/4399").处理 },
    };
    // ^^^^^^^^^^ 在这里注册破解规则 ^^^^^^^^^^

    /**
     * @param {string} 域名或ip
     * @returns {{ 名字: string, 处理: (请求:http.IncomingMessage,响应文本:string) => string }}
     */
    function 获取破解规则(域名或ip) {
        let 获取到的破解规则 = 破解规则[域名或ip];
        if (获取到的破解规则) {
            return 获取到的破解规则;
        } else {
            return { 名字: "", 处理: (请求, 响应文本) => 响应文本 };
        }
    }
    /**
     * 域名转ip, 绕过hosts
     * @param {string} 域名
     * @param {(ip: string, 错误: Error) => any} 回调
     * @returns {(ip, 错误) => void}
     */
    // eslint-disable-next-line no-unused-vars
    function 域名转ip(域名, 回调) {
        // 回调("127.0.0.1");
        Dns解析器.resolve4(域名, (错误, ip) => {
            if (错误) {
                return 回调(
                    "",
                    new Error(`Dns解析错误, 错误信息: ${错误.code}, 错误码: ${错误.errno}`)
                );
            }
            回调(ip);
        });
    }

    /**
     * 使用这个反代服务器收到的请求, 向被反代的服务器发出请求, 然后修改并返回响应文本
     * @param {http.IncomingMessage} 请求
     * @param {http.ServerResponse} 响应
     * @param {number} 端口
     * @param {string} 协议
     */
    function 处理(请求, 响应, 端口, 协议) {
        try {
            console.log(端口, 协议);

            if (请求.method != "GET") {
                响应.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                响应.end("[防沉迷终结者] 暂不支持处理非GET请求");
            }
            域名转ip(请求.headers.host, (ip, 错误) => {
                if (错误) {
                    return module.exports.遇到错误(错误);
                }
                if (
                    ip == "127.0.0.1" &&
                    请求.headers.host == "127.0.0.1" &&
                    请求.headers.host == "localhost"
                ) {
                    响应.end(null);
                }
                // let url = new URL(请求.url, `${端口}://${request.getHeaders().host}`);
                if (请求.method == "GET") {
                    if (协议 == "https:") {
                        响应.end("fff");
                        https.get(
                            {
                                protocol: 协议,
                                hostname: ip,
                                port: 端口,
                                method: "GET",
                                headers: 请求.headers,
                            },
                            (_响应) => {
                                let 响应文本 = "";
                                _响应.on("data", (d) => {
                                    响应文本 = 响应文本 + d;
                                });
                                _响应.on("end", () => {
                                    响应.writeHead(
                                        _响应.statusCode,
                                        _响应.statusMessage,
                                        _响应.headers
                                    );
                                    响应.write(
                                        获取破解规则(请求.headers.host).处理(请求, 响应文本)
                                    );
                                    响应.end();
                                });
                                _响应.on("error", (e) => {
                                    响应.writeHead(200, {
                                        "Content-Type": "text/html;charset=utf-8",
                                    });
                                    响应.write("[防沉迷终结者] 遇到错误\n");
                                    响应.end(e);
                                });
                            }
                        );
                    } else if (协议 == "http:") {
                        http.get(
                            {
                                protocol: 协议,
                                hostname: ip,
                                port: 端口,
                                method: "GET",
                                headers: 请求.headers,
                            },
                            (_响应) => {
                                let 响应文本 = "";
                                _响应.on("data", (d) => {
                                    console.log(d);
                                    响应文本 = 响应文本 + d;
                                });
                                _响应.on("end", () => {
                                    响应.writeHead(
                                        _响应.statusCode,
                                        _响应.statusMessage,
                                        _响应.headers
                                    );
                                    响应.write(
                                        获取破解规则(请求.headers.host).处理(请求, 响应文本)
                                    );
                                    响应.end();
                                });
                                _响应.on("error", (e) => {
                                    响应.writeHead(200, {
                                        "Content-Type": "text/html;charset=utf-8",
                                    });
                                    响应.write("[防沉迷终结者] 遇到错误\n");
                                    响应.end(e);
                                });
                            }
                        );
                    }
                }
            });
        } catch (e) {
            响应.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            响应.write("[防沉迷终结者] 遇到错误\n");
            响应.end(e);
        }
    }

    /**
     *
     * @param {number} 端口
     * @param {string} 协议
     * @returns {(请求:http.IncomingMessage, 响应:http.ServerResponse) => void}
     */
    function 收到请求时(端口, 协议) {
        /**
         * @param {http.IncomingMessage} 请求
         * @param {http.ServerResponse} 响应
         */
        return (请求, 响应) => {
            处理(请求, 响应, 端口, 协议);
        };
    }

    https.createServer(选项, 收到请求时(443, "https:")).listen(443, () => {
        console.log("服务器启动完毕(https)");
    });
    // http.createServer({}, 收到请求时(80, "http:")).listen(80, () => {
    //     console.log("服务器启动完毕(http)");
    // });
} catch (e) {
    module.exports.遇到错误(e);
}
