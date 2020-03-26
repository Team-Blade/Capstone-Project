export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(20, 20, true);
    this.key = config.key.slice(0, -1);
    this.scene = config.scene;
    this.game = config.game;
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
      console.log("in right");
      this.anims.play("moveRight", true);
    }
  }
}
