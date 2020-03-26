export default class SmallPac extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(60, 60, true);
    this.setOrigin(0, 0);
    this.scene = config.scene;
    this.key = config.key;
  }
  createAnimations() {
    this.scene.anims.create({
      key: "ysleft",
      frames: [{ key: "ysclosed" }, { key: "ysleft1" }, { key: "ysleft2" }],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: "ysright",
      frames: [{ key: "ysclosed" }, { key: "ysright1" }, { key: "ysright2" }],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: "ysup",
      frameRate: 10,
      frames: [{ key: "ysclosed" }, { key: "ysup1" }, { key: "ysup2" }],
      repeat: -1
    });
    this.scene.anims.create({
      key: "ysdown",
      frames: [{ key: "ysclosed" }, { key: "ysdown1" }, { key: "ysdown2" }],
      frameRate: 10,
      repeat: -1
    });
  }
  move(direction) {
    this.createAnimations();

    if (direction === "up") {
      this.setVelocityY(-180);
      this.anims.play("ysup", true);
    } else if (direction === "down") {
      this.setVelocityY(180);
      this.anims.play("ysdown", true);
    } else if (direction === "left") {
      this.setVelocityX(-180);
      this.anims.play("ysleft", true);
    } else if (direction === "right") {
      this.setVelocityX(180);
      this.anims.play("ysright", true);
    }
  }
}
