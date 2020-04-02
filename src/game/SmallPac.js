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
    this.moving = false;
    this.big = false;
    this.vulnerable = true;
    this.direction = "";
    this.dead = false;
    this.turnPoint = {};
    this.turnTo = "";
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
    this.scene.anims.create({
      key: `death`,
      frames: [
        { key: `${this.color}death1` },
        { key: `${this.color}death2` },
        { key: `${this.color}death3` },
        { key: `${this.color}death4` },
        { key: `${this.color}death5` },
        { key: `${this.color}death6` },
        { key: `${this.color}death7` },
        { key: `${this.color}death8` }
      ],
      frameRate: 8,
      repeat: 0
    });
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

  trajectory() {
    this.checkSurroundingTiles();
    // console.log(
    //   'pac:', 'x=', this.tilePositionX, 'y=', this.tilePositionY,
    //   'up:', this.tileUp,
    //   'down', this.tileDown,
    //   'left', this.tileLeft,
    //   'right', this.tileRight
    // )
    //animate pac-man consistently
    if (this.direction) {
      this.move(this.direction);
    }
    //change the direction pac man is facing in animation
    this.changePacFace();
    //change direction pac man is headed
    this.changePacDirection();
    //update tile position property of pacman
    this.updateTilePosition();
    //makes sure pacman wraps and stays on map
    this.wrap();
  }

  move(direction) {
    this.moving = true;
    if (this.big) {
      this.color = this.bigColor;
    }
    this.createAnimations();
    if (direction === `up`) {
      this.setVelocityY(-165);
      this.setVelocityX(0);
      this.anims.play(`${this.color}up`, true);
    } else if (direction === `down`) {
      this.setVelocityY(165);
      this.setVelocityX(0);
      this.anims.play(`${this.color}down`, true);
    } else if (direction === `left`) {
      this.setVelocityX(-165);
      this.setVelocityY(0);
      this.anims.play(`${this.color}left`, true);
    } else if (direction === `right`) {
      this.setVelocityX(165);
      this.setVelocityY(0);
      this.anims.play(`${this.color}right`, true);
    }
  }

  // updateOldPosition() {
  //   this.oldPosition = {
  //     x: this.x,
  //     y: this.y,
  //     tileX: this.map.worldToTileX(this.x),
  //     tileY: this.map.worldToTileY(this.y),
  //     scale: this.scale
  //   };
  // }

  checkDirection(turnTo) {
    if(this[`tile${turnTo}`] &&
      !this[`tile${turnTo}`].collides &&
      this.direction !== turnTo){

        this.turnPoint.x = this.scene.map.tileToWorldX(this.tilePositionX + 0.57);
        this.turnPoint.y = this.scene.map.tileToWorldY(this.tilePositionY + 0.57);
  
        if (Phaser.Math.Fuzzy.Equal(this.x, this.turnPoint.x, 13.7) &&
            Phaser.Math.Fuzzy.Equal(this.y, this.turnPoint.y, 13.7)){
              // console.log('passed2'); 
              this.x = this.turnPoint.x;
              this.y = this.turnPoint.y;
              return true;
        }
        // else {
        //   // console.log('not passed');
        //   console.log(this.x, this.turnPoint.x);
        //   console.log(this.y, this.turnPoint.y)
        // }
    }
    else {
      return false;
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

  death() {
    console.log('inside death')
    this.createAnimations();
    this.anims.play("death");
  }
}
