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
    this.load.image("ysdeath1", "/public/assets/yellowSmall/GameMain114.png");
    this.load.image("ysdeath2", "/public/assets/yellowSmall/GameMain115.png");
    this.load.image("ysdeath3", "/public/assets/yellowSmall/GameMain116.png");
    this.load.image("ysdeath4", "/public/assets/yellowSmall/GameMain117.png");
    this.load.image("ysdeath5", "/public/assets/yellowSmall/GameMain118.png");
    this.load.image("ysdeath6", "/public/assets/yellowSmall/GameMain119.png");
    this.load.image("ysdeath7", "/public/assets/yellowSmall/GameMain120.png");
    this.load.image("ysdeath8", "/public/assets/yellowSmall/GameMain121.png");

    //pacman yellow big preload images
    this.load.image("ybclosed", "/public/assets/yellowBig/GameMain230.png");
    this.load.image("ybleft1", "/public/assets/yellowBig/GameMain233.png");
    this.load.image("ybleft2", "/public/assets/yellowBig/GameMain234.png");
    this.load.image("ybright1", "/public/assets/yellowBig/GameMain235.png");
    this.load.image("ybright2", "/public/assets/yellowBig/GameMain236.png");
    this.load.image("ybup1", "/public/assets/yellowBig/GameMain237.png");
    this.load.image("ybup2", "/public/assets/yellowBig/GameMain238.png");
    this.load.image("ybdown1", "/public/assets/yellowBig/GameMain231.png");
    this.load.image("ybdown2", "/public/assets/yellowBig/GameMain232.png");

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
    this.load.image("bsdeath1", "/public/assets/blueSmall/GameMain130.png");
    this.load.image("bsdeath2", "/public/assets/blueSmall/GameMain131.png");
    this.load.image("bsdeath3", "/public/assets/blueSmall/GameMain132.png");
    this.load.image("bsdeath4", "/public/assets/blueSmall/GameMain133.png");
    this.load.image("bsdeath5", "/public/assets/blueSmall/GameMain134.png");
    this.load.image("bsdeath6", "/public/assets/blueSmall/GameMain135.png");
    this.load.image("bsdeath7", "/public/assets/blueSmall/GameMain136.png");
    this.load.image("bsdeath8", "/public/assets/blueSmall/GameMain137.png");

    //pacman blue big preload images

    this.load.image("bbclosed", "/public/assets/blueBig/GameMain248.png");
    this.load.image("bbleft1", "/public/assets/blueBig/GameMain251.png");
    this.load.image("bbleft2", "/public/assets/blueBig/GameMain252.png");
    this.load.image("bbright1", "/public/assets/blueBig/GameMain253.png");
    this.load.image("bbright2", "/public/assets/blueBig/GameMain254.png");
    this.load.image("bbup1", "/public/assets/blueBig/GameMain255.png");
    this.load.image("bbup2", "/public/assets/blueBig/GameMain256.png");
    this.load.image("bbdown1", "/public/assets/blueBig/GameMain249.png");
    this.load.image("bbdown2", "/public/assets/blueBig/GameMain250.png");

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
    this.load.image("psdeath1", "/public/assets/pinkSmall/GameMain122.png");
    this.load.image("psdeath2", "/public/assets/pinkSmall/GameMain123.png");
    this.load.image("psdeath3", "/public/assets/pinkSmall/GameMain124.png");
    this.load.image("psdeath4", "/public/assets/pinkSmall/GameMain125.png");
    this.load.image("psdeath5", "/public/assets/pinkSmall/GameMain126.png");
    this.load.image("psdeath6", "/public/assets/pinkSmall/GameMain127.png");
    this.load.image("psdeath7", "/public/assets/pinkSmall/GameMain128.png");
    this.load.image("psdeath8", "/public/assets/pinkSmall/GameMain129.png");

    //pacman pink big preload images
    this.load.image("pbclosed", "/public/assets/pinkBig/GameMain239.png");
    this.load.image("pbleft1", "/public/assets/pinkBig/GameMain242.png");
    this.load.image("pbleft2", "/public/assets/pinkBig/GameMain243.png");
    this.load.image("pbright1", "/public/assets/pinkBig/GameMain244.png");
    this.load.image("pbright2", "/public/assets/pinkBig/GameMain245.png");
    this.load.image("pbup1", "/public/assets/pinkBig/GameMain246.png");
    this.load.image("pbup2", "/public/assets/pinkBig/GameMain247.png");
    this.load.image("pbdown1", "/public/assets/pinkBig/GameMain240.png");
    this.load.image("pbdown2", "/public/assets/pinkBig/GameMain241.png");

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
    this.load.image("rsdeath1", "/public/assets/redSmall/GameMain138.png");
    this.load.image("rsdeath2", "/public/assets/redSmall/GameMain139.png");
    this.load.image("rsdeath3", "/public/assets/redSmall/GameMain140.png");
    this.load.image("rsdeath4", "/public/assets/redSmall/GameMain141.png");
    this.load.image("rsdeath5", "/public/assets/redSmall/GameMain142.png");
    this.load.image("rsdeath6", "/public/assets/redSmall/GameMain143.png");
    this.load.image("rsdeath7", "/public/assets/redSmall/GameMain144.png");
    this.load.image("rsdeath8", "/public/assets/redSmall/GameMain145.png");

    //pacman red big preload images
    this.load.image("rbclosed", "/public/assets/redBig/GameMain257.png");
    this.load.image("rbleft1", "/public/assets/redBig/GameMain260.png");
    this.load.image("rbleft2", "/public/assets/redBig/GameMain261.png");
    this.load.image("rbright1", "/public/assets/redBig/GameMain262.png");
    this.load.image("rbright2", "/public/assets/redBig/GameMain263.png");
    this.load.image("rbup1", "/public/assets/redBig/GameMain264.png");
    this.load.image("rbup2", "/public/assets/redBig/GameMain265.png");
    this.load.image("rbdown1", "/public/assets/redBig/GameMain258.png");
    this.load.image("rbdown2", "/public/assets/redBig/GameMain259.png");

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

    //load ghost flashing images
    this.load.image("ghostFlash1", "/public/assets/extract/GameMain214.png"); //blue 1
    this.load.image("ghostFlash2", "/public/assets/extract/GameMain214.png"); //blue 2
    this.load.image("ghostFlash3", "/public/assets/extract/GameMain214.png"); //white 1
    this.load.image("ghostFlash4", "/public/assets/extract/GameMain214.png"); //white 2
    this.load.image("ghostFlash5", "/public/assets/extract/GameMain214.png"); //back
    this.load.image("ghostEyesDown", "/public/assets/extract/GameMain266.png");
    this.load.image("ghostEyesLeft", "/public/assets/extract/GameMain267.png");
    this.load.image("ghostEyesRight", "/public/assets/extract/GameMain268.png");
    this.load.image("ghostEyesDown", "/public/assets/extract/GameMain269.png");
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

    this.collisionLayer.setScale(0.7);

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

    this.collisionLayerFoodDots.setScale(this.collisionLayer.scale);

    window.addEventListener("resize", resizeCanvas);
    // const WIDTH = this.collisionLayer.displayWidth;
    // const HEIGHT = this.collisionLayer.displayHeight;

    function resizeCanvas() {
      const canvas = document.querySelector("canvas");
      canvas.style.width = `${(window.innerWidth / 1860) * 1860}px`;
      canvas.style.height = `${(window.innerWidth / 1860) * 900}px`;
    }

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

    // this.ghosts.add(this.pg);
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
          otherPlayer.move(playerInfo.direction);
        }
      });
    });
  }
  update() {
    this.og.trajectory();
    this.direction = "";

    if (this.pac) {
      if (this.cursors.up.isDown) {
        this.pac.move("up");
        this.direction = "up";
      }
      if (this.cursors.down.isDown) {
        this.pac.move("down");
        this.direction = "down";
      }
      if (
        this.cursors.left.isDown &&
        this.pac.tilePositionY >= 0 &&
        this.pac.tilePositionY < 14
      ) {
        this.pac.move("left");
        this.direction = "left";
      }
      if (
        this.cursors.right.isDown &&
        this.pac.tilePositionY >= 0 &&
        this.pac.tilePositionY < 14
      ) {
        this.pac.move("right");
        this.direction = "right";
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
          y: this.pac.y,
          direction: this.direction
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
        if (this.og.tilePositionY >= 15 && this.og.body.velocity.y > 0) {
          this.og.y = this.map.tileToWorldY(1);
        }

        if (this.og.tilePositionY < 0 && this.og.body.velocity.y < 0) {
          this.og.y = this.map.tileToWorldY(13);
        }
      }

      // const resized =
      //   this.pac.oldPosition && this.pac.oldPosition.scale !== this.pac.scale;

      // if (resized) {
      //   this.pac.x = this.map.tileToWorldX(this.pac.oldPosition.tileX);
      //   this.pac.y = this.map.tileToWorldY(this.pac.oldPosition.tileY);
      // }
      this.og.tilePositionX = this.map.worldToTileX(this.og.x);
      this.og.tilePositionY = this.map.worldToTileY(this.og.y);
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
  scene.pac.setScale(scene.collisionLayer.scale * 1.4); //.99
  scene.pac.tilePositionX = scene.map.worldToTileX(scene.pac.x);
  scene.pac.tilePositionY = scene.map.worldToTileY(scene.pac.y);

  scene.physics.add.collider(scene.pac, scene.collisionLayer, (pac, layer) => {
    pac.moving = false;
    pac.anims.stopOnFrame(pac.anims.currentAnim.frames[1]);
  });
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
  otherPlayer.createAnimations();
  otherPlayer.setScale(scene.collisionLayer.scale * 1.4);
  scene.physics.add.collider(otherPlayer, scene.collisionLayer);

  scene.otherPlayersArray.push(otherPlayer);
  otherPlayer.playerId = player.playerId;
  scene.otherPlayers.add(otherPlayer);
}
