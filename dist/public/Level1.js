import Ghost from "./Ghost.js";
import SmallPac from "./SmallPac.js";
import { socket } from "../../client/App";
import loadImages from "./imagesToLoad";
import setUpLayers from "./setUpLayers";
import {
  listenForPlayerMovement,
  listenForGhostMovement,
  listenForDotActivity,
  listenForGhostDeath
} 
  from "./socketListeners"
import addPlayer from "./addPlayer"
import addOtherPlayers from "./otherPlayers"
import {sendMovementInfo, sendGhostMovement} from "./socketEmiters"
import checkWin from "./checkWin"

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

    listenForGhostMovement(this);

    listenForDotActivity(this);

    listenForPlayerMovement(this);

    listenForGhostDeath(this);
    // this.ghosts.add(this.pg);
    this.ghosts.add(this.og);
    this.og.setBounce(0, 1);

    this.physics.add.collider(this.ghosts, this.collisionLayer);

    //processes DOM input events if true
    this.input.enabled = true;
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    checkWin(this);
    if (this.og.dead) {
      this.og.disableBody(true, true);
    }
    if (this.pac) {
      if (this.pac.playerNumber === 1) {
        this.og.trajectory();
        sendGhostMovement(this);
        if(this.og.dead){
          this.socket.emit("ghostDeath", socket.roomId);
        }
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