import express from "express";
import cors from "cors";
import MessageRoutes from "./components/message/routes";
import UserRoutes from "./components/user/routes";
import ChatsRoutes from "./components/chats/routes";
import GalleryRoutes from "./components/gallery/routes";
import getUserNameByToken from "./utlis/getUserNameByToken";
import createTables from "./utlis/createTables";
import WS, { WebSocket } from "ws";
import C from "./constants";

import initialize from "./components/initializer";

const app = express();

const PORT = 8080;

app.use("/", express.static("public"));
app.use(cors());

app.use("/message", MessageRoutes);
app.use("/user", UserRoutes);
app.use("/chats", ChatsRoutes);
app.use("/gallery", GalleryRoutes);

app.post("/init", initialize);

export const wss = new WS.Server({
  port: PORT + 1,
});

export const clients = new Map<string, WebSocket>();
export const connections = new Map<WebSocket, string>();

wss.on("connection", (socket) => {
  socket.on("message", (token) => {
    try {
      const userName = getUserNameByToken(String(token));
      clients.set(userName, socket);
      connections.set(socket, userName);
    } catch (e) {
      socket.send(JSON.stringify({ error: C.AUTH_ERROR }));
      socket.close();
    }
  });

  socket.on("close", async () => {
    const userName = connections.get(socket);

    if (userName) {
      clients.delete(userName);
      connections.delete(socket);
    }
  });
});

app.listen(PORT, async () => {
  await createTables();
  console.log("Сервер запущен");
});
