const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("New client connected"),
    socket.on("chat message", (msg) => {
      //console.log("message: " + msg);
      io.emit("chat message", msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
