console.log("服务器启动中");
import https from "https";
import fs from "fs";
import { IncomingMessage, ServerResponse } from "http";

interface 破解规则类型 {
    域名或ip: string;
    名字: string;
    处理: (请求文本: string) => string;
}

const 选项: https.ServerOptions = {
    key: fs.readFileSync("ssl/server.key"),
    cert: fs.readFileSync("ssl/server.crt"),
};

/**********破解规则**********/
const 破解规则: any = [
    {
        域名或ip: "www.4399.com",
        名字: "4399小游戏",
        处理: (请求文本: string): string => {
            return 请求文本;
        },
    },
];
/**************************/

async function 域名转ip({
    域名,
    回调,
}: {
    域名: string;
    回调: (ip: string) => void;
}): Promise<string> {
    let ip = 域名;
    return ip;
}
async function 获取响应文本({
    请求,
    回调,
}: {
    请求: IncomingMessage;
    回调: (响应文本: string) => void;
}): Promise<void> {
    回调(破解规则[0].处理("hhh"));
}

https
    .createServer(选项, (请求: IncomingMessage, 响应: ServerResponse): void => {
        console.log("请求: ", 请求.headers);

        获取响应文本({
            请求,
            回调: (响应文本: string) => {
                响应.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                响应.end(String(请求.headers));
            },
        });

        console.log("响应: ", 响应);
    })
    .listen(443, (): void => {
        console.log("服务器启动完毕(https)");
    });
https
    .createServer({}, (请求: IncomingMessage, 响应: ServerResponse): void => {
        // 收到请求时(请求, 响应);
    })
    .listen(80, (): void => {
        console.log("服务器启动完毕(http)");
    });

// module.exports = { 请求处理器 };
