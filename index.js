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
            ws.send("Not a supported server.");
        }
	});
});

setInterval(() => {
    servers = JSON.parse(fs.readFileSync("servers.json"));
}, 10000)