export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }
  preload() {
    this.load.image("test", "/public/assets/extract/MapB4_Alpha.png");
    this.load.image("pacmaptiles", "/public/assets/MapA4_neon.png");
    this.load.tilemapTiledJSON("map", "/public/assets/pacmap4830.json");
    this.load.spritesheet("pacYellow", "/public/assets/royale.png", {
      frameWidth: 32,
      frameHeight: 28
    });
  }
  create() {
    let map;
    let layer;
    map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16
    });

    const tileset = map.addTilesetImage("pacmaptiles", "pacmaptiles");
    layer = map.createStaticLayer("Level1Map", tileset, 0, 0);

    this.player = this.physics.add.sprite(300, 200, "pacYellow", 7);
    this.player.setScale(0.7, 0.7);
    this.physics.add.collider(this.player, layer);
    layer.setCollisionByProperty({ collision: true });

    //sprite movement
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
    this.input.enabled = true;
  }
  update() {
    let cursors = this.input.keyboard.createCursorKeys();
    if (cursors.up.isDown) {
      this.player.setVelocityY(-180);
      this.player.anims.play("up", true);
    }
    if (cursors.down.isDown) {
      this.player.setVelocityY(180);
      this.player.anims.play("down", true);
    }
    if (cursors.left.isDown) {
      this.player.setVelocityX(-180);
      this.player.anims.play("left", true);
    }
    if (cursors.right.isDown) {
      this.player.setVelocityX(180);
      this.player.anims.play("right", true);
    }
  }
}
