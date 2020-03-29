export default class SmallPac extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(42, 42, true);
    this.setOrigin(-0.2, -0.2);
    this.scene = config.scene;
    this.key = config.key;
    this.color = this.key.slice(0, 2);
    this.bigColor = `${this.key.slice(0, 1)}b`;
    this.moving = false;
    this.big = false;
  }
  createAnimations() {
    if (this.big) {
      this.color = this.bigColor;
    }
    this.scene.anims.create({
      key: `${this.color}left`,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}left1` },
        { key: `${this.color}left2` }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: `${this.color}right`,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}right1` },
        { key: `${this.color}right2` }
      ],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: `${this.color}up`,
      frameRate: 10,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}up1` },
        { key: `${this.color}up2` }
      ],
      repeat: -1
    });
    this.scene.anims.create({
      key: `${this.color}down`,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}down1` },
        { key: `${this.color}down2` }
      ],
      frameRate: 10,
      repeat: -1
    });
  }
  move(direction) {
    this.moving = true;
    if (this.big) {
      this.color = this.bigColor;
    }
    this.createAnimations();
    if (direction === `up`) {
      this.setVelocityY(-180);
      this.anims.play(`${this.color}up`, true);
    } else if (direction === `down`) {
      this.setVelocityY(180);
      this.anims.play(`${this.color}down`, true);
    } else if (direction === `left`) {
      this.setVelocityX(-180);
      this.anims.play(`${this.color}left`, true);
    } else if (direction === `right`) {
      this.setVelocityX(180);
      this.anims.play(`${this.color}right`, true);
    }
  }
}
