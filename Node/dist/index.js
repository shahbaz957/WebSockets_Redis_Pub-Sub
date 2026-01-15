// import http from "http"
import WebSocket, { WebSocketServer } from "ws";
// const server = http.createServer(function (req : any , res : any) {
//     console.log((new Date()) + " Recieved request for URL :" + req.url)
//     res.end("Hi this is the Pure HTTP server")
// })
// const wss = new WebSocketServer({server})
// let userConnect = 0 ;
// wss.on('connection' , (socket) => {
//     socket.on('error' , (err) => console.log(err))
//     socket.on('message' , (data) => {
//         wss.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN && client != socket){
//                 client.send(data.toString());
//             }
//         })
//     })
//     console.log("User connected : " , ++userConnect);
//     socket.send("Hello Message from WSS Server")
// })
// server.listen(8003 , () => console.log((new Date()) + "Hello from server"))
import express from "express";
const app = express();
const httpServer = app.listen(3000, () => console.log((new Date()) + "Hello from server"));
const wss = new WebSocketServer({ server: httpServer });
wss.on('connection', (socket) => {
    wss.on("error", (err) => console.log(err));
    wss.on('message', (data) => {
        wss.clients.forEach((client) => {
            if (client != socket && client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });
    socket.send("WSS server is connected");
});
//# sourceMappingURL=index.js.map