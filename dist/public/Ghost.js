export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.key = config.key.slice(0, -1);
    this.scene = config.scene;
  }

  createAnimation() {
    this.scene.anims.create({
      key: `move`,
      frames: [
        { key: `${this.key}1` },
        { key: `${this.key}1` },
        { key: `${this.key}2` },
        { key: `${this.key}2` },
        { key: `${this.key}3` },
        { key: `${this.key}4` },
        { key: `${this.key}5` }
      ],
      frameRate: 4,
      repeat: -1
    });
  }
}
