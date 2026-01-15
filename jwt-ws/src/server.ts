import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import { authenticateWS } from "./auth.js";
import type { WSUser } from "./types.js";

dotenv.config();

const wss = new WebSocketServer({ port: 3001 });

console.log("Websocket Server is now listening at PORT 3001");

interface AuthedWS extends WebSocket {
  user?: WSUser;
}

wss.on("connection", (socket: AuthedWS, req) => {
  try {
    const user = authenticateWS(req);
    socket.user = user;
    console.log("Connected User : ", user);
  } catch (error) {
    socket.send(
      JSON.stringify({
        event: "ERROR",
        data: {
          message: "Unauthorized or Invalid Token",
        },
      })
    );
    socket.close();
    return;
  }
  socket.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.event === "BROADCAST") {
      if (socket.user?.role != "teacher") {
        socket.send(
          JSON.stringify({
            event: "ERROR",
            data: { message: "Not Authorized to send data" },
          })
        );
        return;
      }
      wss.clients.forEach((client) => {
        const c = client as AuthedWS;
        if (c.readyState == WebSocket.OPEN) {
          c.send(
            JSON.stringify({
              event: "BROADCAST",
              data: msg.data,
            })
          );
        }
      });
    }
  });
});
