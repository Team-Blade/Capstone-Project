import Ghost from "./Ghost.js";
import SmallPac from "./SmallPac.js";
import { socket } from "../../client/App";
import loadImages from "./imagesToLoad";
import setUpLayers from "./setUpLayers";

export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this["1"] = {
      startPositions: { x: 12, y: 5 },
      color: "y"
    };
    this["2"] = {
      startPositions: { x: 18, y: 5 },
      color: "r"
    };
    this["3"] = {
      startPositions: { x: 12, y: 9 },
      color: "b"
    };
    this["4"] = {
      startPositions: { x: 18, y: 9 },
      color: "p"
    };

    this.socket = socket;
    this.otherPlayersArray = [];

    this.playersAlive = {};
  }
  preload() {
    //loads image for tileset
    loadImages(this);
    //loads image of map
    this.load.tilemapTiledJSON(
      "map",
      "/public/assets/newMapWithFoodDots4.json"
    );
  }

  create() {
    // this.directions = {};
    const scene = this;

    this.otherPlayers = this.physics.add.group();
    this.ghosts = this.physics.add.group();

    this.socket.on("currentPlayers", (players, room) => {
      Object.keys(players).forEach(playerId => {
        if (playerId === scene.socket.id) {
          addPlayer(scene, players[playerId]);
        } else {
          addOtherPlayers(scene, players[playerId]);
        }
      });
    });
    this.socket.on("newPlayer", playerInfo => {
      addOtherPlayers(scene, playerInfo);
    });
    this.socket.on("disconnect", playerId => {
      scene.otherPlayers.getChildren().forEach(otherPlayer => {
        if (playerId === otherPlayer.playerId) {
          // otherPlayer.destroy();
        }
      });
    });

    //makes the tilemap and defines the height and width of the tiles
    this.map = this.make.tilemap({
      key: "map",
      tileWidth: 60,
      tileHeight: 60
    });
    // let map = this.add.tilemap("map");
    //adds the tileset to the map

    setUpLayers(this);

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();

    this.og = new Ghost({
      scene: scene,
      key: "og1",
      x: scene.map.tileToWorldX(15),
      y: scene.map.tileToWorldY(7.5),
      game: this.game
    });

    this.socket.on("ghostMove", ghost => {
      this.og.vulnerable = ghost.vulnerable;
      this.og.setPosition(ghost.x, ghost.y);
      this.og.move(ghost.direction);
      this.og.wrap();
    });

    this.socket.on("smallDotGone", dots => {
      let x = dots.x;
      let y = dots.y;
      this.dots.getChildren().forEach(dot => {
        if (dot.x === x && dot.y === y) {
          dot.destroy();
        }
      });
    });
    this.socket.on("foodGone", food => {
      let x = food.x;
      let y = food.y;
      this.food.getChildren().forEach(foodItem => {
        if (foodItem.x === x && foodItem.y === y) {
          foodItem.destroy();
        }
      });
    });
    this.socket.on("bigDotGone", dots => {
      let x = dots.x;
      let y = dots.y;
      this.bigDots.getChildren().forEach(dot => {
        if (dot.x === x && dot.y === y) {
          dot.destroy();
        }
      });
    });

    // this.ghosts.add(this.pg);
    this.ghosts.add(this.og);
    this.og.setBounce(0, 1);

    this.physics.add.collider(this.ghosts, this.collisionLayer);

    //processes DOM input events if true
    this.input.enabled = true;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.socket.on("playerMoved", playerInfo => {
      scene.otherPlayers.getChildren().forEach(otherPlayer => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
          otherPlayer.big = playerInfo.big;
          otherPlayer.move(playerInfo.direction);
          otherPlayer.vulnerable = playerInfo.vulnerable;
        }
      });
    });
  }
  update() {
    checkWin(this);
    if (this.pac) {
      if (this.pac.playerNumber === 1) {
        this.og.trajectory();
        sendGhostMovement(this);
      }

      this.pac.trajectory();

      this.otherPlayersArray.forEach(player => {
        player.wrap();
        player.updateTilePosition();
      });

      sendMovementInfo(this);

      this.pac.oldPosition = {
        x: this.pac.x,
        y: this.pac.y,
        tileX: this.map.worldToTileX(this.pac.x),
        tileY: this.map.worldToTileY(this.pac.y),
        scale: this.pac.scale
      };
      if (this.og.vulnerable) {
        this.og.turnBlue();
      }

      this.physics.add.overlap(this.pac, this.dots, (pac, dots) => {
        this.socket.emit(
          "ateSmallDot",
          { x: dots.x, y: dots.y },
          socket.roomId
        );
        dots.destroy();
      });
      this.physics.add.overlap(this.pac, this.food, (pac, food) => {
        this.socket.emit("ateFood", { x: food.x, y: food.y }, socket.roomId);
        food.destroy();
      });
      this.physics.add.overlap(this.pac, this.bigDots, (pac, dots) => {
        this.socket.emit("ateBigDot", { x: dots.x, y: dots.y }, socket.roomId);
        dots.destroy();
        pac.big = true;
        pac.vulnerable = false
        this.og.vulnerable = true;
        this.time.delayedCall(
          5000,
          () => {
            this.pac.big = false;
            this.pac.vulnerable = true;
            this.og.vulnerable = false;
            // console.log(this.pac.big, this.pac.vulnerable, this.og.vulnerable);
          },
          [],
          this
        );
      });
    }
  }
}
function addPlayer(scene, player) {
  const playerNumber = player.playerNumber;
  const x = scene[playerNumber].startPositions.x;
  const y = scene[playerNumber].startPositions.y;

  scene.pac = new SmallPac({
    scene: scene,
    x: scene.map.tileToWorldX(x) + 5.5,
    y: scene.map.tileToWorldY(y) + 5.5,
    key: `${scene[playerNumber].color}sclosed`,
    playerNumber: playerNumber
  });
  scene.pac.setScale(scene.collisionLayer.scale * 1.4); //.99
  scene.pac.tilePositionX = scene.map.worldToTileX(scene.pac.x);
  scene.pac.tilePositionY = scene.map.worldToTileY(scene.pac.y);

  scene.playersAlive[playerNumber] = scene.pac;

  scene.physics.add.collider(scene.pac, scene.collisionLayer, (pac, layer) => {
    pac.moving = false;
    //had to take it cause because it was throwing an error on player2, could not read frames
    // pac.anims.stopOnFrame(pac.anims.currentAnim.frames[1]);
  });
  scene.physics.add.collider(scene.pac, scene.otherPlayers, (pac, other) => {
    if (!pac.big && other.big) {
      pac.disableBody(true, true)
      delete scene.playersAlive[pac.playerNumber]
    }
  });
  scene.physics.add.overlap(scene.pac, scene.og, () => {
    if (!scene.pac.big && scene.og.vulnerable === false) {
      scene.pac.disableBody(true, true);
      delete scene.playersAlive[scene.pac.playerNumber];
    } else {
      scene.og.disableBody(true, true);
    }
  });
}
function addOtherPlayers(scene, player) {
  const x = scene[player.playerNumber].startPositions.x;
  const y = scene[player.playerNumber].startPositions.y;
  const playerNumber = player.playerNumber;

  const otherPlayer = new SmallPac({
    scene: scene,
    x: scene.map.tileToWorldX(x),
    y: scene.map.tileToWorldY(y),
    key: `${scene[playerNumber].color}sclosed`,
    playerNumber: playerNumber
  });

  otherPlayer.setScale(scene.collisionLayer.scale * 1.4);
  otherPlayer.tilePositionX = scene.map.worldToTileX(otherPlayer.x);
  otherPlayer.tilePositionY = scene.map.worldToTileY(otherPlayer.y);
  scene.physics.add.collider(otherPlayer, scene.collisionLayer);
  scene.physics.add.collider(otherPlayer, scene.pac, () => {
    if (!otherPlayer.big && scene.pac.big) {
      otherPlayer.disableBody(true, true);
      delete scene.playersAlive[otherPlayer.playerNumber];
    }
  });

  scene.physics.add.collider(otherPlayer, scene.og, () => {
    if (!otherPlayer.big && scene.og.vulnerable === false) {
      otherPlayer.disableBody(true, true);
      delete scene.playersAlive[otherPlayer.playerNumber];
    } else {
      scene.og.disableBody(true, true);
    }
  });
  scene.otherPlayersArray.push(otherPlayer);
  scene.playersAlive[playerNumber] = otherPlayer;
  otherPlayer.playerId = player.playerId;
  scene.otherPlayers.add(otherPlayer);
}

function checkWin(scene) {
  const playersAlive = Object.keys(scene.playersAlive);
  if (playersAlive.length === 1) {
    console.log('WINNER: player', playersAlive[0]);
  }
}

function sendMovementInfo(scene) {
  let x = scene.pac.x;
  let y = scene.pac.y;
  const moving =
    scene.pac.oldPosition &&
    (x !== scene.pac.oldPosition.x || y !== scene.pac.oldPosition.y);
  if (moving) {
    scene.socket.emit("playerMovement", {
      roomId: socket.roomId,
      socketId: socket.id,
      x: scene.pac.x,
      y: scene.pac.y,
      direction: scene.pac.direction,
      big: scene.pac.big,
      vulnerable: scene.pac.vulnerable
    });
  }
}

function sendGhostMovement(scene) {
  scene.socket.emit(
    "ghostMovement",
    {
      x: scene.og.x,
      y: scene.og.y,
      direction: scene.og.direction,
      vulnerable: scene.og.vulnerable
    },
    socket.roomId
  );
}

function resizeCanvas() {
  const canvas = document.querySelector("canvas");
  canvas.style.width = `${(window.innerWidth / 1860) * 1860}px`;
  canvas.style.height = `${(window.innerWidth / 1860) * 900}px`;
}
