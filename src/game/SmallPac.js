export default class SmallPac extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.playerNumber);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    // this.setSize(60, 60, true)
    this.setCircle(7, 7, 7);
    // this.setOrigin(0.5, 0.5);
    this.scene = config.scene;
    this.key = config.key;
    this.playerNumber = config.playerNumber;
    this.color = this.key.slice(0, 2);
    this.bigColor = `${this.key.slice(0, 1)}b`;
    this.moving = true;
    this.big = false;
    this.vulnerable = true;
    this.direction = "";
    this.dead = false;
    this.turnPoint = {};
    this.turnTo = "";
    this.speed = 200;
    this.colliding = false;
    this.collisionDirection = "";
  }
  createAnimations() {
    if (this.big) {
      this.color = this.bigColor;
      this.vulnerable = false;
      this.setOffset(21, 21);
    } else {
      this.color = this.key.slice(0, 2);

      this.setOffset(7, 7);
      this.vulnerable = true;
    }
    this.scene.anims.create({
      key: `${this.color}left`,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}left1` },
        { key: `${this.color}left2` },
      ],
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: `${this.color}right`,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}right1` },
        { key: `${this.color}right2` },
      ],
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: `${this.color}up`,
      frameRate: 10,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}up1` },
        { key: `${this.color}up2` },
      ],
      repeat: -1,
    });
    this.scene.anims.create({
      key: `${this.color}down`,
      frames: [
        { key: `${this.color}closed` },
        { key: `${this.color}down1` },
        { key: `${this.color}down2` },
      ],
      frameRate: 10,
      repeat: -1,
    });
  }

  trajectory() {
    if (this.colliding) {
      this.collisionWithPlayers();
    }
    if (!this.colliding) {
      this.checkSurroundingTiles();

      this.setTurnPoint();
      this.centerPac();
      //animate pac-man consistently
      if (this.direction) {
        this.move(this.direction);
      }
      //change the direction pac man is facing in animation
      this.changePacFace();
      //change direction pac man is headed
      this.changePacDirection();
    }
    //update tile position property of pacman
    this.updateTilePosition();
    //makes sure pacman wraps and stays on map
    this.wrap();
  }

  changePacFace() {
    if (this.body.velocity.x > 0) {
      this.direction = "right";
    }

    if (this.body.velocity.x < 0) {
      this.direction = "left";
    }

    if (this.body.velocity.y > 0) {
      this.direction = "down";
    }

    if (this.body.velocity.y < 0) {
      this.direction = "up";
    }
  }

  changePacDirection() {
    if (this.scene.cursors.up.isDown && this.checkDirection("up")) {
      this.move("up");
      this.direction = "up";
    }
    if (this.scene.cursors.down.isDown && this.checkDirection("down")) {
      this.move("down");
      this.direction = "down";
    }
    if (
      this.scene.cursors.left.isDown &&
      this.checkDirection("left") &&
      this.tilePositionY > 0 &&
      this.tilePositionY < 14
    ) {
      this.move("left");
      this.direction = "left";
    }
    if (
      this.scene.cursors.right.isDown &&
      this.checkDirection("right") &&
      this.tilePositionY > 0 &&
      this.tilePositionY < 14
    ) {
      this.move("right");
      this.direction = "right";
    }
  }

  updateTilePosition() {
    this.tilePositionX = this.scene.map.worldToTileX(this.x);
    this.tilePositionY = this.scene.map.worldToTileY(this.y);
  }

  wrap() {
    if (this.tilePositionY >= 15 && this.body.velocity.y > 0) {
      this.y = this.scene.map.tileToWorldY(-1);
    }

    if (this.tilePositionY < 0 && this.body.velocity.y < 0) {
      this.y = this.scene.map.tileToWorldY(15);
    }
  }

  move(direction) {
    this.moving = true;
    if (this.big) {
      this.color = this.bigColor;
    }
    this.createAnimations();
    if (direction === `up`) {
      this.setVelocityY(-this.speed);
      this.setVelocityX(0);
      this.anims.play(`${this.color}up`, true);
    } else if (direction === `down`) {
      this.setVelocityY(this.speed);
      this.setVelocityX(0);
      this.anims.play(`${this.color}down`, true);
    } else if (direction === `left`) {
      this.setVelocityX(-this.speed);
      this.setVelocityY(0);
      this.anims.play(`${this.color}left`, true);
    } else if (direction === `right`) {
      this.setVelocityX(this.speed);
      this.setVelocityY(0);
      this.anims.play(`${this.color}right`, true);
    }
  }

  checkDirection(turnTo) {
    if (
      this[`tile${turnTo}`] &&
      !this[`tile${turnTo}`].collides &&
      this.direction !== turnTo
    ) {
      if (this.fuzzyEqualXY(11)) {
        this.snapToTurnPoint();
        return true;
      }
      if (!this.direction) {
        return true;
      }
    } else {
      return false;
    }
  }

  setTurnPoint() {
    this.turnPoint.x = this.scene.map.tileToWorldX(this.tilePositionX + 0.57);
    this.turnPoint.y = this.scene.map.tileToWorldY(this.tilePositionY + 0.57);
  }

  snapToTurnPoint() {
    this.x = this.turnPoint.x;
    this.y = this.turnPoint.y;
  }

  fuzzyEqualXY(threshold) {
    const fuzzy =
      Phaser.Math.Fuzzy.Equal(this.x, this.turnPoint.x, threshold) &&
      Phaser.Math.Fuzzy.Equal(this.y, this.turnPoint.y, threshold);
    return fuzzy;
  }

  centerPac() {
    if (this.x !== this.turnPoint.x && this.body.velocity.y !== 0) {
      this.x = this.turnPoint.x;
    }
    if (this.y !== this.turnPoint.y && this.body.velocity.x !== 0) {
      this.y = this.turnPoint.y;
    } else if (
      this.body.velocity.x === 0 &&
      this.body.velocity.y === 0 &&
      !this.fuzzyEqualXY(25) &&
      (!this.tilePositionY >= 15 || !this.tilePositionY <= -1)
    ) {
      this.snapToTurnPoint();
    }
  }

  checkSurroundingTiles() {
    this["tileup"] = this.scene.map.getTileAt(
      this.tilePositionX,
      this.tilePositionY - 1,
      false,
      "mapBaseLayer"
    );
    this["tiledown"] = this.scene.map.getTileAt(
      this.tilePositionX,
      this.tilePositionY + 1,
      false,
      "mapBaseLayer"
    );
    this["tileleft"] = this.scene.map.getTileAt(
      this.tilePositionX - 1,
      this.tilePositionY,
      false,
      "mapBaseLayer"
    );
    this["tileright"] = this.scene.map.getTileAt(
      this.tilePositionX + 1,
      this.tilePositionY,
      false,
      "mapBaseLayer"
    );

    if (
      this.direction &&
      this[`tile${this.direction}`] &&
      this[`tile${this.direction}`].collides
    ) {
      setTimeout(() => {
        this.snapToTurnPoint();
        this.direction = "";
      }, 33);
    }
  }

  collisionWithPlayers() {
    this.collisionDirection === "left" ? this.setVelocityX(-600) : null;
    this.collisionDirection === "right" ? this.setVelocityX(600) : null;
    this.collisionDirection === "up" ? this.setVelocityY(-600) : null;
    this.collisionDirection === "down" ? this.setVelocityY(600) : null;
  }

  death() {
    console.log("top of func", this.color);

    this.scene.anims.create({
      key: "death",
      frames: [
        { key: `${this.key.slice(0, 2)}death1` },
        { key: `${this.key.slice(0, 2)}death2` },
        { key: `${this.key.slice(0, 2)}death3` },
        { key: `${this.key.slice(0, 2)}death4` },
        { key: `${this.key.slice(0, 2)}death5` },
        { key: `${this.key.slice(0, 2)}death6` },
        { key: `${this.key.slice(0, 2)}death7` },
        { key: `${this.key.slice(0, 2)}death8` },
      ],
      frameRate: 16,
      repeat: 0,
    });
    this.anims.play("death", true);
  }
}
