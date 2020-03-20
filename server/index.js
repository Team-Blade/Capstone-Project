const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/node_modules"));
app.get("/", function(req, res, next) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(client) {
  console.log("Client connected...");
  client.on("join", function(data) {
    console.log(data.data());
  });
});

server.listen(8080);
