export default class SmallPac extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(60, 60, true);
    this.setOrigin(0, 0);
    this.scene = config.scene;
    this.key = config.key;
    this.color = this.key[0];
  }
  createAnimations() {
    this.scene.anims.create({
      key: `${this.color}sleft`,
      frames: [{ key: `${this.color}sclosed` }, { key: `${this.color}sleft1` }, { key: `${this.color}sleft2` }],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: `${this.color}sright`,
      frames: [{ key: `${this.color}sclosed` }, { key: `${this.color}sright1` }, { key: `${this.color}sright2` }],
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: `${this.color}sup`,
      frameRate: 10,
      frames: [{ key: `${this.color}sclosed` }, { key: `${this.color}sup1` }, { key: `${this.color}sup2` }],
      repeat: -1
    });
    this.scene.anims.create({
      key: `${this.color}sdown`,
      frames: [{ key: `${this.color}sclosed` }, { key: `${this.color}sdown1` }, { key: `${this.color}sdown2` }],
      frameRate: 10,
      repeat: -1
    });
  }
  move(direction) {
    this.createAnimations();

    if (direction === `up`) {
      this.setVelocityY(-180);
      this.anims.play(`${this.color}sup`, true);
    } else if (direction === `down`) {
      this.setVelocityY(180);
      this.anims.play(`${this.color}sdown`, true);
    } else if (direction === `left`) {
      this.setVelocityX(-180);
      this.anims.play(`${this.color}sleft`, true);
    } else if (direction === `right`) {
      this.setVelocityX(180);
      this.anims.play(`${this.color}sright`, true);
    }
  }
}
