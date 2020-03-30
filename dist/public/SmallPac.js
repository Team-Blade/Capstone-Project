export default class SmallPac extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key, config.playerNumber);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.setSize(42, 42, true);
    this.setOrigin(-0.177, -0.177);
    this.scene = config.scene;
    this.key = config.key;
    this.playerNumber = config.playerNumber;
    this.color = this.key.slice(0, 2);
    this.bigColor = `${this.key.slice(0, 1)}b`;
    this.moving = false;
    this.big = false;
    this.vulnerable = true;
    this.direction = "";
    // this.positiveVelocity = 180;
    // this.negativeVelocity = this.velocity * -1;
    
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
    if (this.scene.cursors.up.isDown) {
      this.move("up");
      this.direction = "up";
    }
    if (this.scene.cursors.down.isDown) {
      this.move("down");
      this.direction = "down";
    }

    if (
      this.scene.cursors.left.isDown &&
      this.tilePositionY > 0 &&
      this.tilePositionY < 14
    ) {
      this.move("left");
      this.direction = "left";
    }
    if (
      this.scene.cursors.right.isDown &&
      this.tilePositionY > 0 &&
      this.tilePositionY < 14
    ) {
      this.move("right");
      this.direction = "right";
    }
  }

  updateTilePosition() {
    this.tilePositionX = this.scene.map.worldToTileX(this.x) + 1;
    this.tilePositionY = this.scene.map.worldToTileY(this.y) + 1;
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
  death() {
    this.createAnimations();
    this.anims.play("death");
  }
}
