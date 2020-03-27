import Ghost from "./Ghost.js";
import SmallPac from "./SmallPac.js";
import { socket } from "../../client/App";
export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    // this.startPositions = {
    //   "1": { x: 12, y: 5 },
    //   "2": { x: 18, y: 5 },
    //   "3": { x: 12, y: 9 },
    //   "4": { x: 18, y: 9 }
    // };
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
  }
  preload() {
    //loads image for tileset
    this.load.image("pinksquare", "/public/assets/pinksquare.jpeg");
    this.load.image("blacksquare", "public/assets/blacksquare.png");
    //loads image of map
    this.load.tilemapTiledJSON(
      "map",
      "/public/assets/newMapWithFoodDots4.json"
    );
    //loads yellow pacman
    this.load.spritesheet("pacYellow", "/public/assets/royale.png", {
      frameWidth: 32,
      frameHeight: 28
    });
    // this.load.spritesheet("pacYellow", "/public/assets/royale.png", {
    //   frameWidth: 32,
    //   frameHeight: 28
    // });

    //pacman yellow small pre-load images
    this.load.image("ysclosed", "/public/assets/yellowSmall/GameMain020.png");
    this.load.image("ysleft1", "/public/assets/yellowSmall/GameMain023.png");
    this.load.image("ysleft2", "/public/assets/yellowSmall/GameMain024.png");
    this.load.image("ysright1", "/public/assets/yellowSmall/GameMain025.png");
    this.load.image("ysright2", "/public/assets/yellowSmall/GameMain026.png");
    this.load.image("ysup1", "/public/assets/yellowSmall/GameMain027.png");
    this.load.image("ysup2", "/public/assets/yellowSmall/GameMain028.png");
    this.load.image("ysdown1", "/public/assets/yellowSmall/GameMain021.png");
    this.load.image("ysdown2", "/public/assets/yellowSmall/GameMain022.png");

    //pacman blue small preload images
    this.load.image("bsclosed", "/public/assets/blueSmall/GameMain038.png");
    this.load.image("bsleft1", "/public/assets/blueSmall/GameMain041.png");
    this.load.image("bsleft2", "/public/assets/blueSmall/GameMain042.png");
    this.load.image("bsright1", "/public/assets/blueSmall/GameMain043.png");
    this.load.image("bsright2", "/public/assets/blueSmall/GameMain044.png");
    this.load.image("bsup1", "/public/assets/blueSmall/GameMain045.png");
    this.load.image("bsup2", "/public/assets/blueSmall/GameMain046.png");
    this.load.image("bsdown1", "/public/assets/blueSmall/GameMain039.png");
    this.load.image("bsdown2", "/public/assets/blueSmall/GameMain040.png");

    //pacman pink small preload images
    this.load.image("psclosed", "/public/assets/pinkSmall/GameMain029.png");
    this.load.image("psleft1", "/public/assets/pinkSmall/GameMain032.png");
    this.load.image("psleft2", "/public/assets/pinkSmall/GameMain033.png");
    this.load.image("psright1", "/public/assets/pinkSmall/GameMain034.png");
    this.load.image("psright2", "/public/assets/pinkSmall/GameMain035.png");
    this.load.image("psup1", "/public/assets/pinkSmall/GameMain036.png");
    this.load.image("psup2", "/public/assets/pinkSmall/GameMain037.png");
    this.load.image("psdown1", "/public/assets/pinkSmall/GameMain030.png");
    this.load.image("psdown2", "/public/assets/pinkSmall/GameMain031.png");

    //pacman red small preload images
    this.load.image("rsclosed", "/public/assets/redSmall/GameMain047.png");
    this.load.image("rsleft1", "/public/assets/redSmall/GameMain050.png");
    this.load.image("rsleft2", "/public/assets/redSmall/GameMain051.png");
    this.load.image("rsright1", "/public/assets/redSmall/GameMain052.png");
    this.load.image("rsright2", "/public/assets/redSmall/GameMain053.png");
    this.load.image("rsup1", "/public/assets/redSmall/GameMain054.png");
    this.load.image("rsup2", "/public/assets/redSmall/GameMain055.png");
    this.load.image("rsdown1", "/public/assets/redSmall/GameMain048.png");
    this.load.image("rsdown2", "/public/assets/redSmall/GameMain049.png");

    //orange ghost preload images
    this.load.image("og1", "/public/assets/ghosts/GameMain178.png"); //down
    this.load.image("og2", "/public/assets/ghosts/GameMain179.png"); //down
    this.load.image("og3", "/public/assets/ghosts/GameMain180.png"); //left
    this.load.image("og4", "/public/assets/ghosts/GameMain181.png"); //left
    this.load.image("og5", "/public/assets/ghosts/GameMain182.png"); //right
    this.load.image("og6", "/public/assets/ghosts/GameMain183.png"); //right
    this.load.image("og7", "/public/assets/ghosts/GameMain184.png"); //up
    this.load.image("og8", "/public/assets/ghosts/GameMain185.png"); //up
    this.load.image("og9", "/public/assets/ghosts/GameMain186.png"); //back

    //purple ghost preload images
    this.load.image("pg1", "/public/assets/ghosts/GameMain187.png"); //down
    this.load.image("pg2", "/public/assets/ghosts/GameMain188.png"); //down
    this.load.image("pg3", "/public/assets/ghosts/GameMain189.png"); //left
    this.load.image("pg4", "/public/assets/ghosts/GameMain190.png"); //left
    this.load.image("pg5", "/public/assets/ghosts/GameMain191.png"); //right
    this.load.image("pg6", "/public/assets/ghosts/GameMain192.png"); //right
    this.load.image("pg7", "/public/assets/ghosts/GameMain193.png"); //up
    this.load.image("pg8", "/public/assets/ghosts/GameMain194.png"); //up
    this.load.image("pg9", "/public/assets/ghosts/GameMain195.png"); //back

    //dots and food preload images

    this.load.image("smallDot", "/public/assets/extract/GameMain219.png");
    this.load.image("largeDot", "/public/assets/extract/Common061.png");
    this.load.image("candy", "/public/assets/food/GameMain004.png");
    this.load.image("burger", "/public/assets/food/GameMain006.png");
    this.load.image("papaya", "/public/assets/food/GameMain008.png");
    this.load.image("peach", "/public/assets/food/GameMain010.png");
    this.load.image("pizzaSlice", "/public/assets/food/GameMain011.png");
    this.load.image("cakeSlice", "/public/assets/food/GameMain003.png");
    this.load.image("egg", "/public/assets/food/GameMain014.png");
  }

  create() {
    // this.directions = {};
    const scene = this;
    this.socket = socket;
    this.otherPlayers = this.physics.add.group();
    this.ghosts = this.physics.add.group();

    this.otherPlayersArray = [];
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
          otherPlayer.destroy();
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

    let map = this.map;

    const pinkTileset = map.addTilesetImage("pinksquare", "pinksquare");
    const blackTileset = map.addTilesetImage("blacksquare", "blacksquare");
    const smallDotTileset = map.addTilesetImage("GameMain219", "smallDot");
    const largeDotTileset = map.addTilesetImage("Common061", "largeDot");
    const candyTileset = map.addTilesetImage("GameMain004", "candy");
    const burgerTileset = map.addTilesetImage("GameMain006", "burger");
    const papayaTileset = map.addTilesetImage("GameMain008", "papaya");
    const peachTileset = map.addTilesetImage("GameMain010", "peach");
    const pizzaSliceTileset = map.addTilesetImage("GameMain011", "pizzaSlice");
    const cakeSliceTileset = map.addTilesetImage("GameMain003", "cakeSlice");
    const eggTileset = map.addTilesetImage("GameMain014", "egg");

    //creates the map layer, key must match layer name in tiled
    this.collisionLayer = map.createStaticLayer(
      "mapBaseLayer",
      [pinkTileset, blackTileset],
      0,
      0
    );

    this.collisionLayer.setCollisionByProperty({ collision: true });

    this.collisionLayer.setScale(window.innerWidth / 1860);

    //creates the food and dots layer
    this.collisionLayerFoodDots = map.createStaticLayer(
      "foodDotsLayer",
      [
        smallDotTileset,
        largeDotTileset,
        candyTileset,
        burgerTileset,
        papayaTileset,
        peachTileset,
        pizzaSliceTileset,
        cakeSliceTileset,
        eggTileset
      ],
      0,
      0
    );
    this.collisionLayerFoodDots.setCollisionByProperty({ collision: true });

    this.collisionLayerFoodDots.setScale(window.innerWidth / 1860);

    window.addEventListener("resize", resizeCanvas);
    // const WIDTH = this.collisionLayer.displayWidth;
    // const HEIGHT = this.collisionLayer.displayHeight;

    function resizeCanvas() {
      const canvas = document.querySelector("canvas");
      canvas.style.width = `${(window.innerWidth / 1860) * 1860}px`;
      canvas.style.height = `${(window.innerWidth / 1860) * 900}px`;
    }

    //sprite movement yellow pacman
    this.pg = new Ghost({
      scene: scene,
      key: "pg1",
      x: scene.map.tileToWorldX(17),
      y: scene.map.tileToWorldY(7.5),
      game: this.game
    });
    this.og = new Ghost({
      scene: scene,
      key: "og1",
      x: scene.map.tileToWorldX(15),
      y: scene.map.tileToWorldY(7.5),
      game: this.game
    });

    this.ghosts.add(this.pg);
    this.ghosts.add(this.og);
    this.og.setBounce(1);
    this.physics.add.collider(this.ghosts, this.collisionLayer);

    //processes DOM input events if true
    this.input.enabled = true;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.socket.on("playerMoved", playerInfo => {
      scene.otherPlayers.getChildren().forEach(otherPlayer => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
  }
  update() {
    this.og.trajectory();

    if (this.pac) {
      if (this.cursors.up.isDown) {
        this.pac.move("up");
      }
      if (this.cursors.down.isDown) {
        this.pac.move("down");
      }
      if (
        this.cursors.left.isDown &&
        this.pac.tilePositionY >= 0 &&
        this.pac.tilePositionY < 14
      ) {
        this.pac.move("left");
      }
      if (
        this.cursors.right.isDown &&
        this.pac.tilePositionY >= 0 &&
        this.pac.tilePositionY < 14
      ) {
        this.pac.move("right");
      }

      let x = this.pac.x;
      let y = this.pac.y;
      const moving =
        this.pac.oldPosition &&
        (x !== this.pac.oldPosition.x || y !== this.pac.oldPosition.y);
      if (moving) {
        this.socket.emit("playerMovement", {
          roomId: socket.roomId,
          socketId: socket.id,
          x: this.pac.x,
          y: this.pac.y
        });
        this.pac.tilePositionX = this.map.worldToTileX(this.pac.x);
        this.pac.tilePositionY = this.map.worldToTileY(this.pac.y);

        // this.directions[Phaser.UP] = this.map.getTileAt(this.pac.tilePositionX, this.pac.tilePositionY - 1);
        // this.directions[Phaser.DOWN] = this.map.getTileAt(this.pac.tilePositionX, this.pac.tilePositionY + 1);
        // this.directions[Phaser.LEFT] = this.map.getTileAt(this.pac.tilePositionX - 1, this.pac.tilePositionY);
        // this.directions[Phaser.RIGHT] = this.map.getTileAt(this.pac.tilePositionX + 1, this.pac.tilePositionY);

        if (this.pac.tilePositionY >= 15 && this.pac.body.velocity.y > 0) {
          this.pac.y = this.map.tileToWorldY(-1);
        }

        if (this.pac.tilePositionY < 0 && this.pac.body.velocity.y < 0) {
          this.pac.y = this.map.tileToWorldY(15);
        }
      }

      const resized =
        this.pac.oldPosition && this.pac.oldPosition.scale !== this.pac.scale;

      if (resized) {
        this.pac.x = this.map.tileToWorldX(this.pac.oldPosition.tileX);
        this.pac.y = this.map.tileToWorldY(this.pac.oldPosition.tileY);
      }

      this.pac.oldPosition = {
        x: this.pac.x,
        y: this.pac.y,
        tileX: this.map.worldToTileX(this.pac.x),
        tileY: this.map.worldToTileY(this.pac.y),
        scale: this.pac.scale
      };
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
    key: `${scene[player.playerNumber].color}sclosed`
  });
  scene.pac.setScale(scene.collisionLayer.scale);
  scene.pac.tilePositionX = scene.map.worldToTileX(scene.pac.x);
  scene.pac.tilePositionY = scene.map.worldToTileY(scene.pac.y);

  scene.physics.add.collider(scene.pac, scene.collisionLayer);
  scene.physics.add.collider(scene.pac, scene.otherPlayers);

  // scene.directions[Phaser.UP] = scene.map.getTileAt(scene.pac.tilePositionX, scene.pac.tilePositionY - 1);
  // scene.directions[Phaser.DOWN] = scene.map.getTileAt(scene.pac.tilePositionX, scene.pac.tilePositionY + 1);
  // scene.directions[Phaser.LEFT] = scene.map.getTileAt(scene.pac.tilePositionX - 1, scene.pac.tilePositionY);
  // scene.directions[Phaser.RIGHT] = scene.map.getTileAt(scene.pac.tilePositionX + 1, scene.pac.tilePositionY);
}
function addOtherPlayers(scene, player) {
  const x = scene[player.playerNumber].startPositions.x;
  const y = scene[player.playerNumber].startPositions.y;

  const otherPlayer = new SmallPac({
    scene: scene,
    x: scene.map.tileToWorldX(x),
    y: scene.map.tileToWorldY(y),
    key: `${scene[player.playerNumber].color}sclosed`
  });

  otherPlayer.setScale(scene.collisionLayer.scale);
  scene.physics.add.collider(otherPlayer, scene.collisionLayer);

  scene.otherPlayersArray.push(otherPlayer);
  otherPlayer.playerId = player.playerId;
  scene.otherPlayers.add(otherPlayer);
}
