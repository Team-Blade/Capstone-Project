export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }
  preload() {
    //loads image for tileset
    // this.load.image("largepacmanmap", "/public/assets/largepacmanmap.png");
    this.load.image("pinksquare", "/public/assets/pinksquare.jpeg");
    this.load.image("blacksquare", "public/assets/blacksquare.png");
    //loads image of map
    this.load.tilemapTiledJSON("map", "/public/assets/newmap.json");
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

    //pacman orange ghost preload images
    this.load.image("og1", "/public/assets/ghosts/GameMain178.png");
    this.load.image("og2", "/public/assets/ghosts/GameMain179.png");
    this.load.image("og3", "/public/assets/ghosts/GameMain180.png");
    this.load.image("og4", "/public/assets/ghosts/GameMain181.png");
    this.load.image("og5", "/public/assets/ghosts/GameMain182.png");
    this.load.image("og3", "/public/assets/ghosts/GameMain183.png");
    this.load.image("og4", "/public/assets/ghosts/GameMain184.png");
    this.load.image("og5", "/public/assets/ghosts/GameMain185.png");
    this.load.image("og6", "/public/assets/ghosts/GameMain186.png");

    this.load.image("sky", "/public/assets/sky.png");
  }

  create() {
    this.directions = {};
    this.add.image(0, 0, "sky").setScale(5);
    const self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
    this.ghosts = this.physics.add.group();
    this.socket.on("currentPlayers", players => {
      Object.keys(players).forEach(id => {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
        } else {
          addOtherPlayers(self, players[id]);
        }
      });
    });
    this.socket.on("newPlayer", playerInfo => {
      addOtherPlayers(self, playerInfo);
    });
    this.socket.on("disconnect", playerId => {
      self.otherPlayers.getChildren().forEach(otherPlayer => {
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
    //creates the map layer, key must match layer name in tiled
    this.collisionLayer = map.createStaticLayer(
      "mapBaseLayer",
      [pinkTileset, blackTileset],
      0,
      0
    );
    // this.collisionLayer = map.createStaticLayer("collisions layer", tileset, 0, 0);

    //adds a collider for yellow pacman to run into layer when that tile has a collision property of true
    // this.physics.add.collider(this.yellowplayer, this.collisionLayer);
    this.collisionLayer.setCollisionByProperty({ collision: true });

    this.collisionLayer.setScale(window.innerWidth / 1860);

    //sprite movement yellow pacman
    this.anims.create({
      key: "ysleft",
      frames: [{ key: "ysclosed" }, { key: "ysleft1" }, { key: "ysleft2" }],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "ysright",
      frames: [{ key: "ysclosed" }, { key: "ysright1" }, { key: "ysright2" }],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "ysup",
      frameRate: 10,
      frames: [{ key: "ysclosed" }, { key: "ysup1" }, { key: "ysup2" }],
      repeat: -1
    });
    this.anims.create({
      key: "ysdown",
      frames: [{ key: "ysclosed" }, { key: "ysdown1" }, { key: "ysdown2" }],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "ogMove",
      frames: [
        { key: "og1" },
        { key: "og2" },
        { key: "og3" },
        { key: "og4" },
        { key: "og5" },
        { key: "og6" }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.og = this.add.sprite(
      self.map.tileToWorldX(15),
      self.map.tileToWorldY(7.5),
      "og1"
    );
    this.ghosts.add("og1");

    //processes DOM input events if true
    this.input.enabled = true;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.socket.on("playerMoved", playerInfo => {
      self.otherPlayers.getChildren().forEach(otherPlayer => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
  }
  update() {
    this.og.anims.play("ogMove");
    this.collisionLayer.setScale(window.innerWidth / 1860);

    if (this.pac) {
      this.pac.setScale(window.innerWidth / 1861);

      if (this.cursors.up.isDown) {
        this.pac.setVelocityY(-180);
        this.pac.anims.play("ysup", true);
      }
      if (this.cursors.down.isDown) {
        this.pac.setVelocityY(180);
        this.pac.anims.play("ysdown", true);
      }
      if (
        this.cursors.left.isDown &&
        this.pac.tilePositionY >= 0 &&
        this.pac.tilePositionY < 14
      ) {
        this.pac.setVelocityX(-180);
        this.pac.anims.play("ysleft", true);
      }
      if (
        this.cursors.right.isDown &&
        this.pac.tilePositionY >= 0 &&
        this.pac.tilePositionY < 14
      ) {
        this.pac.setVelocityX(180);
        this.pac.anims.play("ysright", true);
      }

      let x = this.pac.x;
      let y = this.pac.y;
      if (
        this.pac.oldPosition &&
        (x !== this.pac.oldPosition.x || y !== this.pac.oldPosition.y)
      ) {
        this.socket.emit("playerMovement", { x: this.pac.x, y: this.pac.y });

        this.pac.tilePositionX = this.map.worldToTileX(this.pac.x);
        this.pac.tilePositionY = this.map.worldToTileY(this.pac.y);

        this.directions[Phaser.UP] = this.map.getTileAt(
          this.pac.tilePositionX,
          this.pac.tilePositionY - 1
        );
        this.directions[Phaser.DOWN] = this.map.getTileAt(
          this.pac.tilePositionX,
          this.pac.tilePositionY + 1
        );
        this.directions[Phaser.LEFT] = this.map.getTileAt(
          this.pac.tilePositionX - 1,
          this.pac.tilePositionY
        );
        this.directions[Phaser.RIGHT] = this.map.getTileAt(
          this.pac.tilePositionX + 1,
          this.pac.tilePositionY
        );

        if (this.pac.tilePositionY >= 15 && this.pac.body.velocity.y > 0) {
          this.pac.y = this.map.tileToWorldY(-1);
        }

        if (this.pac.tilePositionY < 0 && this.pac.body.velocity.y < 0) {
          this.pac.y = this.map.tileToWorldY(15);
        }
      }

      if (
        this.pac.oldPosition &&
        this.pac.oldPosition.scale !== this.pac.scale
      ) {
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
function addPlayer(self, playerInfo) {
  self.pac = self.physics.add
    .sprite(
      self.map.tileToWorldX(12) + 11,
      self.map.tileToWorldY(5) + 9,
      "ysclosed"
    )
    .setSize(60, 60, true)
    .setOrigin(0, 0);

  self.pac.tilePositionX = self.map.worldToTileX(self.pac.x);
  self.pac.tilePositionY = self.map.worldToTileY(self.pac.y);

  self.physics.add.collider(self.pac, self.collisionLayer);
  self.physics.add.collider(self.pac, self.otherPlayers);

  self.directions[Phaser.UP] = self.map.getTileAt(
    self.pac.tilePositionX,
    self.pac.tilePositionY - 1
  );
  self.directions[Phaser.DOWN] = self.map.getTileAt(
    self.pac.tilePositionX,
    self.pac.tilePositionY + 1
  );
  self.directions[Phaser.LEFT] = self.map.getTileAt(
    self.pac.tilePositionX - 1,
    self.pac.tilePositionY
  );
  self.directions[Phaser.RIGHT] = self.map.getTileAt(
    self.pac.tilePositionX + 1,
    self.pac.tilePositionY
  );
}
function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, "pacYellow");
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
}
