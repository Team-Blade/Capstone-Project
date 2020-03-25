const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const io = require("socket.io").listen(server);
const uuid = require("uuid/v1");
const rooms = {};

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id, () => {
    // store the room id in the socket for future use
    socket.roomId = room.id;
    console.log(socket.id, "Joined", room.id);
  });
};

io.on("connection", socket => {
  socket.id = uuid();
  console.log("a user connected");

  // players[socket.id] = {
  //   rotation: 0,
  //   x: 700,
  //   y: 500,
  //   playerId: socket.id
  // };

  socket.on("createRoom", roomId => {
    const room = {
      id: roomId, // generate a unique id for the new room, that way we don't need to deal with duplicates.
      sockets: []
    };
    rooms[room.id] = room;
    // have the socket join the room they've just created.
    joinRoom(socket, room);
  });

  socket.on("joinRoom", roomId => {
    const room = rooms[roomId];
    console.log("INSIDE JOIN ROOM EVENT");
    console.log("rooms", rooms);
    console.log("roomID", roomId);
    if (room.sockets.length <= 4) {
      joinRoom(socket, room);
    } else {
      console.log("Sorry, this game is full");
    }
  });

  socket.on("startGame", roomId => {
    let players = rooms[roomId].sockets;
    console.log(rooms[roomId].sockets[socket.id]);

    socket.emit("currentPlayers", players);
    socket.broadcast.emit("newPlayer", players[socket.id]);
    // socket.on("disconnect", () => {
    //   console.log("user disconnected");
    //   delete players[socket.id];
    //   io.emit("disconnect", socket.id);
    // });
    // socket.on("playerMovement", movementData => {
    //   players[socket.id].x = movementData.x;
    //   players[socket.id].y = movementData.y;
    //   socket.broadcast.emit("playerMoved", players[socket.id]);
    // });
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Eating dots on port ${PORT}`);
});
