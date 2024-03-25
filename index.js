const WebSocket = require("ws");
const fs = require("fs");
const { createServer } = require('node:http');
const app = createServer();
let servers = {};
const wss = new WebSocket.Server({ server: app.listen(25565) });

wss.on("connection", (ws, req) => {
	ws.on("message", (message) => {
		if (servers[req.url]) {
			const targetWs = new WebSocket(servers[req.url]);
            targetWs.onerror = (err) => {
                console.error("Error connecting to target:", err.message);
            };

			targetWs.onopen = () => {
				targetWs.send(message);
				ws.on("message", (data) => targetWs.send(data));
				targetWs.onmessage = (data) => ws.send(data.data);
                ws.on("close", () => targetWs.close());
				targetWs.onclose = () => ws.close();
			};
		} else {
			if(message.toString() == "Accept: MOTD") {
				ws.send('{"name":"Selenite","brand":"lax1dude","vers":"EaglerXBungee/1.0.10","cracked":true,"secure":false,"time":1711353901436,"uuid":"e3ed38dd-303a-41ab-9d1d-fac4f50c10e3","type":"motd","data":{"cache":true,"motd":["Selenite Proxy", "This server doesnt exist!"] ,"icon":false,"online":0,"max":0, players:[]}}')
			} else {
				ws.send(Buffer.from("ff003c00540068006900730020006900730020006e006f007400200061002000760061006c0069006400200073006500720076006500720021000a0050006c00650061007300650020007400720079002000770069007400680020006100200064006900660066006500720065006e0074002000550052004c0021", "hex"));
				ws.send(Buffer.from("ff0113556e6b6e6f776e205061636b65742023323530", "hex"));
				ws.close();
			}
        }
	});
});
setInterval(() => {
    servers = JSON.parse(fs.readFileSync("servers.json"));
//}, 300000)
}, 2000);