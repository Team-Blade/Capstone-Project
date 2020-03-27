export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(60, 60, true);
    this.key = config.key.slice(0, -1);
    this.scene = config.scene;
    this.game = config.game;
    this.name = this.key;
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
    console.log("in move");
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
  trajectory() {
    console.log("in trajectory");
    this.TURN_RATE = 5;
    this.SPEED = 250;
    if (this.scene.pac) {
      let targetAngle = Phaser.Math.Angle.Between(
        this.scene.pac.x,
        this.scene.pac.y,
        this.game.input.activePointer.x,
        this.game.input.activePointer.y
      );
      console.log(targetAngle);

      if (this.rotation !== targetAngle) {
        const delta = targetAngle - this.rotation;
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;
        if (delta > 0) {
          // Turn clockwise
          this.angle += this.TURN_RATE;
        } else {
          // Turn counter-clockwise
          this.angle -= this.TURN_RATE;
        }
        if (Math.abs(delta) < Phaser.Math.DegToRad(this.TURN_RATE)) {
          console.log("inequate");
          // this.rotation = targetAngle;
        }
        this.body.velocity.y = Math.cos(this.rotation) * this.SPEED;
        this.body.velocity.x = Math.sin(this.rotation) * this.SPEED;
      }
    }
  }
}
