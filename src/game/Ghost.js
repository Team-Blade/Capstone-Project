export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.setSize(28, 28, true)
    // .setOrigin(0,0)
    // .setOffset(-0.05,-0.05)
    this.setCircle(7,7,7)
    .setScale(this.scene.collisionLayer.scale * 2.1);
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
    this.turnTo = "";
    this.turnPoint = {};
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
      // this.setVelocityY(-110);
      this.anims.play("moveUp", true);
    } else if (direction === "down") {
      // this.setVelocityY(110);
      this.anims.play("moveDown", true);
    } else if (direction === "left") {
      // this.setVelocityX(-110);
      this.anims.play("moveLeft", true);
    } else if (direction === "right") {
      // this.setVelocityX(110);
      this.anims.play("moveRight", true);
    }
  }
  trajectory() {
    if(this.direction) {
      this.move(this.direction);
    }
    if (this.scene.pac) {
      this.checkSurroundingTiles();
      this.decideTarget();
      this.setTurnPoint();
      this.centerGhost();
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

  setTurnPoint() {
    this.turnPoint.x = this.scene.map.tileToWorldX(this.tilePositionX + 0.57);
    this.turnPoint.y = this.scene.map.tileToWorldY(this.tilePositionY + 0.57);
  }

  snapToTurnPoint() {
    this.x = this.turnPoint.x;
    this.y = this.turnPoint.y;
  }

  fuzzyEqualXY(threshold) {
    const fuzzy = Phaser.Math.Fuzzy.Equal(this.x, this.turnPoint.x, threshold)
           &&
           Phaser.Math.Fuzzy.Equal(this.y, this.turnPoint.y, threshold)
    return fuzzy
  }

  centerGhost() {
    
    // if (this.x !== this.turnPoint.x && this.body.velocity.y !== 0){
    //   this.x = this.turnPoint.x;
    // }
    // if (this.y !== this.turnPoint.y && this.body.velocity.x !== 0){
    //   this.y = this.turnPoint.y;
    // }
    // else if (this.body.velocity.x === 0 &&
    //          this.body.velocity.y === 0 &&
    //          !this.fuzzyEqualXY(25) &&
    //          (!this.tilePositionY >= 15 || !this.tilePositionY <= -1)) {

    //             this.snapToTurnPoint();
    // }
  }

  findPac() {
    let count = 0;

    return function() {
      if (count >= 17) {
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

  go(direction) {

    let velocity = 130;

    direction === "left" || direction === "up" ? velocity *= (-1) : null;
    
    
    if ((direction === "left" || direction === "right")) {
      this.setVelocityX(velocity);
      // this.setVelocityY(0);
    }
    if (direction === "up" || direction === "down") {
      this.setVelocityY(velocity);
      // this.setVelocityX(0);
    }

    this.move(direction);
    this.direction = direction;

  }

  followPac() {
    if (this.tilePositionX === this.chaseTarget.tilePositionX) {
      this.vulnerable ? null : this.setVelocityY(0);
    }
    if (this.tilePositionY === this.chaseTarget.tilePositionY) {
      this.vulnerable ? null : this.setVelocityX(0);
    }

    if (this.tilePositionX > this.chaseTarget.tilePositionX) {
      if (this.tilePositionY > 14 || this.tilePositionY < 0) {
        this.setVelocityX(0);
      } else {
        this.vulnerable ? this.go("right") : this.go("left");
      }
    }
    if (this.tilePositionX < this.chaseTarget.tilePositionX) {
      if (this.tilePositionY > 14 || this.tilePositionY < 0) {
        this.setVelocityX(0);
      } else {
        this.vulnerable ? this.go("left") : this.go("right");
      }
    }
    if (this.tilePositionY < this.chaseTarget.tilePositionY) {
      if (
        this.tilePositionY + 1 + (15 - this.chaseTarget.tilePositionY) <
        this.chaseTarget.tilePositionY - this.tilePositionY + 1
      ) {
        this.vulnerable ? this.go("down") : this.go("up");
      } else {
        this.vulnerable ? this.go("up") : this.go("down");
      }
    }
    if (this.tilePositionY > this.chaseTarget.tilePositionY + 1) {
      if (
        15 - this.tilePositionY + this.chaseTarget.tilePositionY + 1 <
        this.tilePositionY - this.chaseTarget.tilePositionY + 1
      ) {
        this.vulnerable ? this.go("up") : this.go("down");
      } else {
        this.vulnerable ? this.go("down") : this.go("up");
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

  checkDirection(turnTo) {
    if(this[`tile${turnTo}`] &&
      !this[`tile${turnTo}`].collides &&
      this.direction !== turnTo){
        return true;
    }
    else {
      return false;
    }
  }

  snapToTurnPoint() {
    this.turnPoint.x = this.scene.map.tileToWorldX(this.tilePositionX + 0.57);
    this.turnPoint.y = this.scene.map.tileToWorldY(this.tilePositionY + 0.57);

    if (Phaser.Math.Fuzzy.Equal(this.x, this.turnPoint.x, 13.7) &&
      Phaser.Math.Fuzzy.Equal(this.y, this.turnPoint.y, 13.7)){
        // console.log('passed2');
        // console.log('x:', 'gh', this.x, this.turnPoint.x);
        // console.log('y:', 'gh', this.y, this.turnPoint.y); 
        this.x = this.turnPoint.x;
        this.y = this.turnPoint.y;
    }
    else {
      // console.log('not passed');
      // console.log('x:', 'gh', this.x, this.turnPoint.x);
      // console.log('y:', 'gh', this.y, this.turnPoint.y);
    }
  }

  checkSurroundingTiles() {
    this['tileup'] = this.scene.map.getTileAt(
      this.tilePositionX,
      this.tilePositionY - 1,
      false,
      "mapBaseLayer"
    );
    this['tiledown'] = this.scene.map.getTileAt(
      this.tilePositionX,
      this.tilePositionY + 1,
      false,
      "mapBaseLayer"
    );
    this['tileleft'] = this.scene.map.getTileAt(
      this.tilePositionX - 1,
      this.tilePositionY,
      false,
      "mapBaseLayer"
    );
    this['tileright'] = this.scene.map.getTileAt(
      this.tilePositionX + 1,
      this.tilePositionY,
      false,
      "mapBaseLayer"
    );
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
