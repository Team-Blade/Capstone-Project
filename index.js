const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");
const io = require("socket.io").listen(server);
const rooms = {};

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const joinRoom = (socket, room, name) => {
  //if the room has not started yet
  console.log("has the room started when joining room?", room.started);
  if (!room.started) {
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
          name: name,
          playerId: socket.id,
          playerNumber: room.numberOfPlayers,
          score: 0
        };
        console.log(
          socket.id,
          `Player${room.players[socket.id].playerNumber}`,
          "Joined",
          room.id
        );
        socket.emit("newPlayers", room.players);
      });
    } else {
      console.log(
        "This room is at capacity. No. of players right now:",
        room.numberOfPlayers
      );
    }
  } else {
    console.log("Room", room.id, "is invalid or has already started");
    socket.emit("gameAlreadyStarted", room.id);
  }
};

class Room {
  constructor(roomId) {
    this.id = roomId;
    this.numberOfPlayers = 0;
    this.sockets = [];
    this.players = {};
    this.started = false;
  }
}

io.on("connection", socket => {
  console.log("a user connected", socket.id);

  socket.on("createRoom", (roomId, name) => {
    room = new Room(roomId);
    rooms[roomId] = room;
    // have the socket join the room they've just created.
    joinRoom(socket, room, name);
  });

  socket.on("joinRoom", (roomId, name) => {
    const room = rooms[roomId];
    if (room) {
      joinRoom(socket, room, name);
    } else {
      console.log("Sorry, game room:", roomId, "not found");
      socket.emit("invalidRoom", roomId);
    }
  });

  socket.on("startGame", roomId => {
    console.log(roomId)
    if (rooms[roomId].numberOfPlayers > 1 || roomId.slice(-4) === "DEMO") {
      rooms[roomId].started = true;
      // io.in(roomId).emit("startCountdown");
      io.in(roomId).emit("currentPlayers", rooms[roomId].players);
      socket.emit("sound");
      io.in(roomId).emit("gameStarted");
    } else {
      socket.emit("notEnoughPlayers");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
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
    } else {
      console.log("rooms[roomId] is false", "rooms:", rooms, "roomId:", roomId);
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
  socket.on("newSmallDot", (dot, roomId) => {
    socket.in(roomId).emit("makeNewSmallDot", dot);
  });
  socket.on("newBigDot", (dot, roomId) => {
    socket.in(roomId).emit("makeNewBigDot", dot);
  });
  socket.on("newFood", (food, roomId) => {
    console.log("inside newFood listener");
    socket.in(roomId).emit("makeNewFood", food);
  });
  socket.on("ghostDeath", roomId => {
    socket.in(roomId).emit("ghostDied");
  });
  socket.on("selfDeath", (roomId, playerNumber) => {
    socket.in(roomId).emit("someoneDied", playerNumber);
  });
  socket.on("gameOver", roomId => {
    console.log("inside gameOver", roomId);
    io.in(roomId).emit("playAgain");
  });
  socket.on("exitGameRoom", roomId => {
    console.log("deleting roomId from db", roomId);
    delete rooms[roomId];
    socket.in(roomId).emit("playerGone", roomId);
  });
  socket.on("toggleSoundFromFront", toggle => {
    socket.emit("toggleSoundToPhaser", toggle);
    socket.emit("sound");
  });
});
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Eating dots on port ${PORT}`);
});

module.exports = { rooms };
