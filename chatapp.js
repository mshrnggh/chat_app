const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server); //socket.ioを使うためのおまじない
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/chatapp.html");
});

const clients = [];

io.on("connection", (socket) => {
  console.log("New client connected, Socket ID: " + socket.id);
  // 接続されたクライアントのsocket.idを保存する
  //clients[socket.id] = socket;
  //`clients[socket.id] = socket;`を使用する場合、socket.idをキーとして保存するため、同じsocket.idを持つクライアントが複数接続した場合、後から接続したクライアントが既に存在するsocket.idを上書きしてしまいます。そのため、同じsocket.idを持つクライアントが複数接続することはできません。ただし、`clients[socket.id] = socket;`を使用する場合、socket.idをキーとして保存するため、特定のsocket.idを持つクライアントを検索することができます。一方、`clients.push(socket);`を使用する場合、配列に追加された順番でクライアントが保存されるため、特定のsocket.idを持つクライアントを検索することができません。
  clients.push(socket);
  //`clients.push(socket.id);`を使用する場合、socket.idを保存する配列に追加するため、同じsocket.idを持つクライアントが複数接続しても、配列に追加されるため、後から接続したクライアントが既に存在するsocket.idを上書きすることはありません。ただし、`clients.push(socket.id);`を使用する場合、特定のsocket.idを持つクライアントを検索することができません。

  socket.on("chat message", (msg, msg_socketId) => {
    for (const client of clients) {
      if (client.id !== socket.id) {
        client.emit("client message", msg, msg_socketId);
      }
    }
  });

  socket.on("disconnect", () => {
    // 接続が切れたクライアントのsocket.idを削除する
    // delete clients[socket.id];
    //    const index = clients.indexOf(socket);
    //    if (index !== -1) {
    //      clients.splice(index, 1);
    //    }   この方法では、誤って同じindexの違うクライアントを切断してしまうおそれがあるので、以下のようにsocket.idを併用利用する方法が望ましい
    const index = clients.findIndex((client) => client.id === socket.id);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  //  以下は、簡易的なチャット形式の場合で、socket.idを利用しない場合に有効な記述
  //   socket.on("chat message", (msg, msg_socketId) => {
  //     io.emit("client message", msg, msg_socketId);
});
server.listen(port, () => console.log(`Listening on port ${port}`));
