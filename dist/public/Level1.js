import Ghost from "./Ghost.js";
import SmallPac from "./SmallPac.js";
import { socket } from "../../client/App";
import loadImages from "./imagesToLoad";
import setUpLayers from "./setUpLayers";
import {
  listenForPlayerMovement,
  listenForGhostMovement,
  listenForDotActivity,
  listenForGhostDeath,
  listenForSomeonesDeath
} from "./socketListeners";
import addPlayer from "./addPlayer";
import addOtherPlayers from "./otherPlayers";
import { sendMovementInfo, sendGhostMovement } from "./socketEmiters";
import checkWin from "./checkWin";

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
    // this.socket.on("newPlayer", playerInfo => {
    //   addOtherPlayers(scene, playerInfo);
    // });
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
      x: scene.map.tileToWorldX(15) + 5.5,
      y: scene.map.tileToWorldY(7) + 5.5,
      game: this.game
    });

    listenForGhostMovement(this);

    listenForDotActivity(this);

    listenForPlayerMovement(this);

    listenForGhostDeath(this);

    listenForSomeonesDeath(this);

    // this.ghosts.add(this.pg);
    this.ghosts.add(this.og);
    this.og.setBounce(0, 1);

    this.physics.add.collider(this.ghosts, this.collisionLayer);

    //processes DOM input events if true
    this.input.enabled = true;
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    //CHECK WIN
    checkWin(this);
    //IF GHOST IS DEAD TELL EVERYONE AND DISABLE GHOST;
    if (this.og.dead && this.og.body.enable) {
      this.socket.emit("ghostDeath", socket.roomId);
      this.og.disableBody(true, true);
    }
    //IF GHOST IS VULNERABLE, TURN BLUE
    //IF YOU ARE SMALL AND OTHER PLAYERS ARE ALSO SMALL, MAKE GHOST NOT VULERABLE
    if (this.og.vulnerable) {
      this.og.turnBlue();
      const playersAreSmall = this.otherPlayersArray.every(
        player => !player.big
      );
      if (playersAreSmall && !this.pac.big) {
        this.og.vulnerable = false;
      }
    }
    //IF PAC EXISTS
    if (this.pac) {
      //IF YOU ARE ALIVE
      if (!this.pac.dead) {
        //UPDATE TRAJECTORY
        this.pac.trajectory();
        //SEND EVERYONE YOUR MOVES
        sendMovementInfo(this);
      }

      //IF YOU ARE PLAYER 1
      if (this.pac.playerNumber === 1) {
        //ELSE LET EVERYONE KNOW WHERE GHOST SHOULD BE
        this.og.trajectory();
        sendGhostMovement(this);
      }
      //IF YOU ARE DEAD TELL EVERYONE AND DELETE YOURSELF
      if (this.pac.dead && this.playersAlive[this.pac.playerNumber]) {
        this.pac.disableBody(true, true);
        this.socket.emit("selfDeath", socket.roomId, this.pac.playerNumber);
        delete this.playersAlive[this.pac.playerNumber];
      }
      //FOR EACH PLAYER
      this.otherPlayersArray.forEach(player => {
        //IF YOU HEAR SOMEONE IS DEAD, DISABLE THEM AND DELETE THEM
        if (player.dead && this.playersAlive[player.playerNumber]) {
          player.death();
          player.disableBody(true, true);
          delete this.playersAlive[player.playerNumber];
        } else {
          //IF SOMEONE IS BIG AND GHOST IS NOT VULNERABLE, MAKE GHOST VULNERABLE
          if (player.big && !this.og.vulnerable) {
            this.og.vulnerable = true;
          }
          player.wrap();
          player.updateTilePosition();
        }
      });
    }
  }
}

function resizeCanvas() {
  const canvas = document.querySelector("canvas");
  canvas.style.width = `${(window.innerWidth / 1860) * 1860}px`;
  canvas.style.height = `${(window.innerWidth / 1860) * 900}px`;
}

// function sendMovementInfo(scene) {
//   let x = scene.pac.x;
//   let y = scene.pac.y;
//   const moving =
//     scene.pac.oldPosition &&
//     (x !== scene.pac.oldPosition.x || y !== scene.pac.oldPosition.y);
//   if (moving) {
//     scene.socket.emit("playerMovement", {
//       roomId: socket.roomId,
//       socketId: socket.id,
//       x: scene.pac.x,
//       y: scene.pac.y,
//       direction: scene.pac.direction,
//       big: scene.pac.big,
//       vulnerable: scene.pac.vulnerable
//     });
//   }
// }

// function sendGhostMovement(scene) {
//   scene.socket.emit(
//     "ghostMovement",
//     {
//       x: scene.og.x,
//       y: scene.og.y,
//       direction: scene.og.direction,
//       vulnerable: scene.og.vulnerable
//     },
//     socket.roomId
//   );
// }

// function listenForPlayerMovement(scene){
//   scene.socket.on("playerMoved", playerInfo => {
//       scene.otherPlayers.getChildren().forEach(otherPlayer => {
//         if (playerInfo.playerId === otherPlayer.playerId) {
//           otherPlayer.setPosition(playerInfo.x, playerInfo.y);
//           otherPlayer.big = playerInfo.big;
//           otherPlayer.move(playerInfo.direction);
//           otherPlayer.vulnerable = playerInfo.vulnerable;
//         }
//       });
//     });
// }

// function listenForGhostMovement(scene) {

//   scene.socket.on("ghostMove", ghost => {
//   scene.og.vulnerable = ghost.vulnerable;
//   scene.og.setPosition(ghost.x, ghost.y);
//   scene.og.move(ghost.direction);
//   scene.og.wrap();
//   });

// }

// function listenForDotActivity (scene) {
//   scene.socket.on("smallDotGone", dots => {
//     let x = dots.x;
//     let y = dots.y;
//     scene.dots.getChildren().forEach(dot => {
//       if (dot.x === x && dot.y === y) {
//         dot.destroy();
//       }
//     });
//   });
//   scene.socket.on("foodGone", food => {
//     let x = food.x;
//     let y = food.y;
//     scene.food.getChildren().forEach(foodItem => {
//       if (foodItem.x === x && foodItem.y === y) {
//         foodItem.destroy();
//       }
//     });
//   });
//   scene.socket.on("bigDotGone", dots => {
//     let x = dots.x;
//     let y = dots.y;
//     scene.bigDots.getChildren().forEach(dot => {
//       if (dot.x === x && dot.y === y) {
//         dot.destroy();
//       }
//     });
//   });
// }
