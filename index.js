const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const io = require("socket.io").listen(server);
const rooms = {};
const players = {};

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id, () => {
    // store the room id in the socket for future use
    socket.roomId = room.id;
    players[socket.id] = {
      rotation: 0,
      x: 700,
      y: 450,
      playerId: socket.id
    };
    console.log(socket.id, "Joined", room.id);
  });
};

io.on("connection", socket => {
  console.log("a user connected", socket.id);

  socket.on("createRoom", roomId => {
    const room = {
      id: roomId,
      sockets: []
    };
    rooms[room.id] = room;
    // have the socket join the room they've just created.
    joinRoom(socket, room);
  });

  socket.on("joinRoom", roomId => {
    const room = rooms[roomId];
    if (room.sockets.length <= 4) {
      joinRoom(socket, room);
    } else {
      console.log("Sorry, this game is full");
    }
  });

  socket.on("startGame", () => {
    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete players[socket.id];
    io.emit("disconnect", socket.id);
  });
  socket.on("playerMovement", movementData => {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    socket.broadcast.emit("playerMoved", players[socket.id]);
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Eating dots on port ${PORT}`);
});
