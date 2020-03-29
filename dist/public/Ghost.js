export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.setSize(42, 42, true).setScale(this.scene.collisionLayer.scale * 1.4);
    this.key = config.key.slice(0, -1);
    this.game = config.game;
    this.name = this.key;
    this.tilePositionX = this.scene.map.worldToTileX(this.x);
    this.tilePositionY = this.scene.map.worldToTileY(this.y);
  }

  createAnimation() {
    this.scene.anims.create({
      key: `moveUp`,
      frames: [{ key: `${this.key}7` }, { key: `${this.key}8` }],
      frameRate: 4,
      repeat: -1
    });
    this.scene.anims.create({
      key: `moveDown`,
      frames: [{ key: `${this.key}1` }, { key: `${this.key}2` }],
      frameRate: 4,
      repeat: -1
    });
    this.scene.anims.create({
      key: `moveLeft`,
      frames: [{ key: `${this.key}3` }, { key: `${this.key}4` }],
      frameRate: 4,
      repeat: -1
    });
    this.scene.anims.create({
      key: `moveRight`,
      frames: [{ key: `${this.key}5` }, { key: `${this.key}6` }],
      frameRate: 4,
      repeat: -1
    });
    this.scene.anims.create({
      key: "turnBlue",
      frames: [{ key: "ghostFlash1" }, { key: "ghostFlash2" }],
      frameRate: 4,
      repeat: -1
    });
    this.scene.anims.create({
      key: "turnWhite",
      frames: [{ key: "ghostFlash3" }, { key: "ghostFlash4" }],
      frameRate: 4,
      repeat: -1
    });
  }
  move(direction) {
    this.createAnimation();

    if (direction === "up") {
      this.setVelocityY(-180);
      this.anims.play("moveUp", true);
    } else if (direction === "down") {
      this.setVelocityY(180);
      this.anims.play("moveDown", true);
    } else if (direction === "left") {
      this.setVelocityX(-180);
      this.anims.play("moveLeft", true);
    } else if (direction === "right") {
      this.setVelocityX(180);
      this.anims.play("moveRight", true);
    }
  }
  trajectory() {
    if (this.scene.pac) {
      if (this.x === this.scene.pac.x) {
        this.setVelocityY(0);
      }
      if (this.y === this.scene.pac.y) {
        this.setVelocityX(0);
      }
      if (this.tilePositionX > this.scene.pac.tilePositionX) {
        if (this.tilePositionY > 14 || this.tilePositionY < 0) {
          this.setVelocityX(0);
        } else this.setVelocityX(-140);
        console.log("moveLeft");
        this.anims.play("moveLeft");
        // this.setVelocityX(-140);
      }
      if (this.tilePositionX < this.scene.pac.tilePositionX) {
        if (this.tilePositionY > 14 || this.tilePositionY < 0) {
          this.setVelocityX(0);
        } else {
          this.setVelocityX(140);
          this.anims.play("moveRight", true);
        }
        // this.setVelocityX(140);
      }
      if (this.scene.map.worldToTileY(this.y) < this.scene.pac.tilePositionY) {
        this.setVelocityY(140);
        this.anims.play("moveDown");
        console.log("moveDown");
      }
      if (this.scene.map.worldToTileY(this.y) > this.scene.pac.tilePositionY) {
        this.setVelocityY(-140);
        this.anims.play("moveUp");
        console.log("moveUp");
      }
    }
  }
  turnBlue() {
    this.createAnimation();
    this.anims.play("turnBlue", true);
  }
  flash() {
    this.createAnimation();
    this.anims.play("turnBlue", true);
    this.anims.play("turnWhite", true);
  }
}
