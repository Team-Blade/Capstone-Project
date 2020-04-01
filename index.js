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
  //if it's not at capacity (Max 4)
  if (room.numberOfPlayers < 4) {
    //store the socket in a socket array
    room.sockets.push(socket);
    //increase # of players in room by 1
    room.numberOfPlayers += 1;
    socket.join(room.id, () => {
      room.players[socket.id] = {
        rotation: 0,
        x: 0,
        y: 0,
        playerId: socket.id,
        playerNumber: room.numberOfPlayers
      };
      console.log(
        socket.id,
        `Player${room.players[socket.id].playerNumber}`,
        "Joined",
        room.id
      );
    });
  } else {
    console.log(
      "This room is at capacity. No. of players right now:",
      room.numberOfPlayers
    );
  }
};

class Room {
  constructor(roomId) {
    this.id = roomId;
    this.numberOfPlayers = 0;
    this.sockets = [];
    this.players = {};
  }
}

io.on("connection", socket => {
  console.log("a user connected", socket.id);

  socket.on("createRoom", roomId => {
    room = new Room(roomId);

    rooms[roomId] = room;
    // have the socket join the room they've just created.
    joinRoom(socket, room);
  });

  socket.on("joinRoom", roomId => {
    const room = rooms[roomId];
    if (room) {
      joinRoom(socket, room);
    } else {
      console.log("Sorry, game room:", roomId, "not found");
    }
  });

  socket.on("startGame", roomId => {
    io.in(roomId).emit("currentPlayers", rooms[roomId].players);
    // socket.in(roomId).emit("newPlayer", rooms[roomId].players[socket.id]);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // if (socket.roomId) {
    //   console.log("before, rooms", rooms);
    //   // delete rooms[socket.roomId].players[socket.id];
    //   console.log("after, rooms", rooms);
    // }
    io.emit("disconnect", socket.id);
  });

  socket.on("playerMovement", movementData => {
    const { x, y, socketId, roomId, direction, big, vulnerable } = movementData;
    if (rooms[roomId]) {
      player = rooms[roomId].players[socketId];
      player.x = x;
      player.y = y;
      player.direction = direction;
      player.big = big;
      player.vulnerable = vulnerable;
      socket.in(roomId).emit("playerMoved", player);
    }
    else {
      console.log('rooms[roomId] is false', 'rooms:', rooms, 'roomId:', roomId);
    }
  });

  socket.on("ghostMovement", (ghost, roomId) => {
    socket.in(roomId).emit("ghostMove", ghost);
  });
  socket.on("ateSmallDot", (dots, roomId) => {
    socket.in(roomId).emit("smallDotGone", dots);
  });
  socket.on("ateFood", (food, roomId) => {
    socket.in(roomId).emit("foodGone", food);
  });
  socket.on("ateBigDot", (bigDots, roomId) => {
    socket.in(roomId).emit("bigDotGone", bigDots);
  });
  socket.on("ghostDeath", (roomId) => {
    socket.in(roomId).emit("ghostDied");
  })
  socket.on("selfDeath", (roomId, playerNumber) => {
    socket.in(roomId).emit("someoneDied", playerNumber);
  })
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Eating dots on port ${PORT}`);
});
