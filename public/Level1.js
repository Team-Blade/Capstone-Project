export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }
  preload() {
    //loads the images we will need for the game
    this.load.image("sky", "/public/assets/sky.png");

    //loads image for tileset
    this.load.image("pacmaptiles", "/public/assets/MapA4_neon.png");
    //loads image of map
    this.load.tilemapTiledJSON("map", "/public/assets/pacmap4830.json");
    //loads yellow pacman
    this.load.spritesheet("pacYellow", "/public/assets/royale.png", {
      frameWidth: 32,
      frameHeight: 28
    });
  }

  create() {
    this.add.image(400, 300, "sky").setDepth(-1);

    //makes the tilemap and defines the height and width of the tiles
    let map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16
    });
    //adds the tileset to the map
    const tileset = map.addTilesetImage("pacmaptiles", "pacmaptiles");
    //creates the map layer, key must match layer name in tiled
    let layer = map.createStaticLayer("Level1Map", tileset, 0, 0);

    //adds a yellow pacman player and makes him smaller
    this.yellowplayer = this.physics.add.sprite(300, 200, "pacYellow", 7);
    // this.yellowplayer.setScale(1, 0.7);

    //adds a collider for yellow pacman to run into layer when that tile has a collision property of true
    this.physics.add.collider(this.yellowplayer, layer);
    layer.setCollisionByProperty({ collision: true });

    //sprite movement yellow pacman
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("pacYellow", {
        start: 4,
        end: 6
      }),
      frameRate: 8,
      repeat: 0
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("pacYellow", {
        start: 7,
        end: 9
      }),
      frameRate: 8,
      repeat: 0
    });
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("pacYellow", {
        start: 9,
        end: 11
      }),
      frameRate: 8,
      repeat: 0
    });
    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("pacYellow", {
        start: 0,
        end: 3
      }),
      frameRate: 8,
      repeat: 0
    });

    //processes DOM input events if true
    this.input.enabled = true;
  }
  update() {
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.up.isDown) {
      this.yellowplayer.setVelocityY(-180);
      this.yellowplayer.anims.play("up", true);
    }
    if (cursors.down.isDown) {
      this.yellowplayer.setVelocityY(180);
      this.yellowplayer.anims.play("down", true);
    }
    if (cursors.left.isDown) {
      this.yellowplayer.setVelocityX(-180);
      this.yellowplayer.anims.play("left", true);
    }
    if (cursors.right.isDown) {
      this.yellowplayer.setVelocityX(180);
      this.yellowplayer.anims.play("right", true);
    }
  }
}
