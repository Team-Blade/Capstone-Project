export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.setSize(42, 42, true)
    .setOrigin(0,0)
    .setScale(this.scene.collisionLayer.scale * 1.4);
    this.key = config.key.slice(0, -1);
    this.game = config.game;
    this.name = this.key;
    this.direction = "";
    this.tilePositionX = this.scene.map.worldToTileX(this.x);
    this.tilePositionY = this.scene.map.worldToTileY(this.y);
    this.vulnerable = false;
    this.chaseTarget = "";
    this.decideTarget = this.findPac();
    this.dead = false;
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
      // this.setVelocityY(-140);
      this.anims.play("moveUp", true);
    } else if (direction === "down") {
      // this.setVelocityY(140);
      this.anims.play("moveDown", true);
    } else if (direction === "left") {
      // this.setVelocityX(-140);
      this.anims.play("moveLeft", true);
    } else if (direction === "right") {
      // this.setVelocityX(140);
      this.anims.play("moveRight", true);
    }
  }
  trajectory() {
    // if(this.direction) {
    //   this.anims.play(this.direction, true);
    // }

    if (this.scene.pac) {
      this.decideTarget();
      if (this.chaseTarget) {
        this.followPac();
      }

      if (this.vulnerable === true) {
        this.turnBlue();
      }
      //ghost wrap
      this.wrap();

      //UPDATE TILE POSITION
      this.updateTilePosition();
    }
  }

  findPac() {
    let count = 0;

    return function() {
      if (count >= 10) {
        count = 0;
        return this.lockOnTarget();
      } else {
        count += 1;
      }
    };
  }

  lockOnTarget() {
    const distancesToGhost = {};
    for (let num in this.scene.playersAlive) {
      const distance = Phaser.Math.Between(
        this.scene.playersAlive[num].tilePositionX,
        this.scene.playersAlive[num].tilePositionY,
        this.tilePositionX,
        this.tilePositionY
      );
      distancesToGhost[distance] = num;
    }
    const shortestDistance = Math.min(...Object.keys(distancesToGhost));
    const closest = distancesToGhost[shortestDistance];

    if (
      this.scene.playersAlive[closest] &&
      this.scene.playersAlive[closest] !== this.chaseTarget
    ) {
      this.chaseTarget = this.scene.playersAlive[closest];
    }

    return this.chaseTarget;
  }

  followPac() {
    if (this.tilePositionX === this.chaseTarget.tilePositionX) {
      this.setVelocityY(0);
    }
    if (this.tilePositionY === this.chaseTarget.tilePositionY) {
      this.setVelocityX(0);
    }
    if (this.tilePositionX > this.chaseTarget.tilePositionX) {
      if (this.tilePositionY > 14 || this.tilePositionY < 0) {
        this.setVelocityX(0);
      } else {
        this.setVelocityX(-140);
        this.move("left");
        this.direction = "left";
      }
    }
    if (this.tilePositionX < this.chaseTarget.tilePositionX) {
      if (this.tilePositionY > 14 || this.tilePositionY < 0) {
        this.setVelocityX(0);
      } else {
        this.setVelocityX(140);
        this.move("right");
        this.direction = "right";
      }
      // this.setVelocityX(140);
    }
    if (this.tilePositionY < this.chaseTarget.tilePositionY) {
      if (
        this.tilePositionY + 1 + (15 - this.chaseTarget.tilePositionY) <
        this.chaseTarget.tilePositionY - this.tilePositionY + 1
      ) {
        this.setVelocityY(-140);
        this.move("up");
        this.direction = "up";
      } else {
        this.setVelocityY(140);
        this.move("down");
        this.direction = "down";
      }
    }
    if (this.tilePositionY > this.chaseTarget.tilePositionY + 1) {
      if (
        15 - this.tilePositionY + this.chaseTarget.tilePositionY + 1 <
        this.tilePositionY - this.chaseTarget.tilePositionY + 1
      ) {
        this.setVelocityY(140);
        this.move("down");
        this.direction = "down";
      } else {
        this.setVelocityY(-140);
        this.move("up");
        this.direction = "up";
      }
    }
  }

  wrap() {
    if (this.tilePositionY >= 15 && this.body.velocity.y > 0) {
      this.y = this.scene.map.tileToWorldY(-1);
    }

    if (this.tilePositionY < 0 && this.body.velocity.y < 0) {
      this.y = this.scene.map.tileToWorldY(15);
    }
  }

  updateTilePosition() {
    this.tilePositionX = this.scene.map.worldToTileX(this.x);
    this.tilePositionY = this.scene.map.worldToTileY(this.y);
  }

  turnBlue() {
    this.createAnimation();
    this.anims.play("turnBlue", true);
    this.vulnerable = true;
  }
  flash() {
    this.createAnimation();
    this.anims.play("turnBlue", true);
    this.anims.play("turnWhite", true);
  }
}
