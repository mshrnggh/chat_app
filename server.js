const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
const port = process.env.PORT || 3000;

// Display client's own message on the right side and other client's messages on the left side
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("New client connected, Socket ID: " + socket.id);
  socket.on("chat message", (msg, msg_socketId) => {
    let msg_indent = "left";
    console.log(msg, socket.id, msg_socketId);
    if (socket.id === msg_socketId) {
      msg_indent = "right";
    }
    io.emit("client message", msg, msg_indent);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
