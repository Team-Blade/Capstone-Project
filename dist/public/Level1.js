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
    // this.load.spritesheet("pacYellow", "/public/assets/royale.png", {
    //   frameWidth: 32,
    //   frameHeight: 28
    // });
  }

  create() {
    // this.directions = {};
    const scene = this;

    this.otherPlayers = this.physics.add.group();
    this.ghosts = this.physics.add.group();

    this.socket.on("currentPlayers", players => {
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
    //sprite movement yellow pacman
    // this.pg = new Ghost({
    //   scene: scene,
    //   key: "pg1",
    //   x: scene.map.tileToWorldX(17),
    //   y: scene.map.tileToWorldY(7.5),
    //   game: this.game
    // });
    this.og = new Ghost({
      scene: scene,
      key: "og1",
      x: scene.map.tileToWorldX(15),
      y: scene.map.tileToWorldY(7.5),
      game: this.game
    });

    this.socket.on("ghostMove", ghost => {
      this.og.setPosition(ghost.x, ghost.y);
      this.og.move(ghost.direction);
      this.og.wrap();
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
        }
      });
    });
    // this.scoreBoard = this.add.text(1100, 800, "PLAYERS", {
    //   fontSize: "100px",
    //   backgroundColor: "#ff0",
    //   color: "#0e0"
    // });
    // this.scoreBoard.setOrigin(0.5, 0.5);
    // this.scoreBoard.setDepth(3);
  }
  update() {
    if (this.pac && this.pac.big === true) {
      this.pac.vulnerable = false;
      this.pac.setOffset(6, 6);
    }
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

      // this.directions[Phaser.UP] = this.map.getTileAt(this.pac.tilePositionX, this.pac.tilePositionY - 1);
      // this.directions[Phaser.DOWN] = this.map.getTileAt(this.pac.tilePositionX, this.pac.tilePositionY + 1);
      // this.directions[Phaser.LEFT] = this.map.getTileAt(this.pac.tilePositionX - 1, this.pac.tilePositionY);
      // this.directions[Phaser.RIGHT] = this.map.getTileAt(this.pac.tilePositionX + 1, this.pac.tilePositionY);

      this.physics.add.overlap(this.pac, this.dots, (pac, dots) => {
        dots.destroy();
      });
      this.physics.add.overlap(this.pac, this.food, (pac, food) => {
        food.destroy();
      });
      this.physics.add.overlap(this.pac, this.bigDots, (pac, dots) => {
        this.og.turnBlue();
        dots.destroy();
        setTimeout(pac => (pac.big = false), 8000);
        console.log("before", pac.big);
        pac.big = true;
        console.log("after", pac.big);
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
    x: scene.map.tileToWorldX(x),
    y: scene.map.tileToWorldY(y),
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
  scene.physics.add.collider(scene.pac, scene.otherPlayers);
  scene.physics.add.overlap(scene.pac, scene.og, () => {
    if (scene.pac.vulnerable === true) {
      scene.pac.disableBody(true, true);
      delete scene.playersAlive[scene.pac.playerNumber];
    } else {
      scene.og.vulnerable = true;
      scene.og.disableBody(true, true);
    }
  });
  // scene.directions[Phaser.UP] = scene.map.getTileAt(scene.pac.tilePositionX, scene.pac.tilePositionY - 1);
  // scene.directions[Phaser.DOWN] = scene.map.getTileAt(scene.pac.tilePositionX, scene.pac.tilePositionY + 1);
  // scene.directions[Phaser.LEFT] = scene.map.getTileAt(scene.pac.tilePositionX - 1, scene.pac.tilePositionY);
  // scene.directions[Phaser.RIGHT] = scene.map.getTileAt(scene.pac.tilePositionX + 1, scene.pac.tilePositionY);
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
  scene.physics.add.collider(otherPlayer, scene.pac);
  scene.physics.add.collider(otherPlayer, scene.og, () => {
    otherPlayer.disableBody(true, true);
    delete scene.playersAlive[otherPlayer.playerNumber];
  });
  scene.otherPlayersArray.push(otherPlayer);
  scene.playersAlive[playerNumber] = otherPlayer;
  otherPlayer.playerId = player.playerId;
  scene.otherPlayers.add(otherPlayer);
}

function checkWin(scene) {
  const playersAlive = Object.keys(scene.playersAlive);
  if (playersAlive.length === 1) {
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
      big: scene.pac.big
    });
  }
}

function sendGhostMovement(scene) {
  scene.socket.emit("ghostMovement", {
    x: scene.og.x,
    y: scene.og.y,
    direction: scene.og.direction
  });
}

function resizeCanvas() {
  const canvas = document.querySelector("canvas");
  canvas.style.width = `${(window.innerWidth / 1860) * 1860}px`;
  canvas.style.height = `${(window.innerWidth / 1860) * 900}px`;
}
