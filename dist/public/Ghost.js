export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(60, 60, true).setScale(0.63);
    this.key = config.key.slice(0, -1);
    this.scene = config.scene;
    this.game = config.game;
    this.name = this.key;
    this.tilePositionX = this.scene.map.worldToTileX(this.x);
    this.tilePositionY = this.scene.map.worldToTileY(this.y);
    console.log("in constructor", this.tilePositionY, this.tilePositionX);
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
    this.createAnimation();
    console.log("in trajectory");
    this.TURN_RATE = 5;
    this.SPEED = 250;
    console.log(this.tilePositionX);
    console.log("y", this.tilePositionY);
    if (this.scene.pac) {
      if (this.x > this.scene.pac.x) {
        if (this.tilePositionY > 14 || this.tilePositionY < 0) {
          this.setVelocityX(0);
        } else this.setVelocityX(-140);
        console.log("moveLeft");
        this.anims.play("moveLeft");
      }
      if (this.x < this.scene.pac.x) {
        if (this.tilePositionY > 14 || this.tilePositionY < 0) {
          this.setVelocityX(0);
        } else {
          this.setVelocityX(140);
          console.log("moveRight");
          this.anims.play("moveRight");
        }
      }
      if (this.y < this.scene.pac.y) {
        this.setVelocityY(140);
        this.anims.play("moveDown");
        console.log("moveDown");
        console.log("pac higher than ghost", this.body.velocity.y);
      }
      if (this.y > this.scene.pac.y) {
        this.setVelocityY(-140);
        this.anims.play("moveUp");
        console.log("moveUp");
        console.log("pac lower than ghost", this.body.velocity.y);
      }
    }
  }
}
