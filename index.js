const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);
const port = process.env.PORT || 3000;
const html = require("fs").readFileSync("./index.html");

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});

io.on("connection", (socket) => {
  console.log("New client connected"),
    socket.on("chat message", (msg) => {
      //console.log("message: " + msg);
      io.emit("chat message", msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
