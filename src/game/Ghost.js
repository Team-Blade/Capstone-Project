import { socket } from "../../components/App";

export default class Ghost extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.buildKey);
    config.scene.add.existing(this);
    config.scene.physics.world.enable(this);
    this.scene = config.scene;
    this.setSize(28, 28, true);
    this.setCircle(7, 7, 7).setScale(this.scene.collisionLayer.scale * 2.1);
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
    this.speed = 130;
    this.previousTile = "";
    this.ghostReleased = false;
    this.unleashed = false;
    this.homeTileX = 15;
    this.homeTileY = 7;
    this.startTileX = "";
    this.startTileY = "";
    this.finalPath = "";
  }

  createAnimation() {

    this.setOffset(7, 7);

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
    this.scene.anims.create({
      key: "onlyEyes",
      frames: [{key: "ghostEyesUp"}],
      frameRate: 1,
      repeat: 1
    })
  }

  trajectory() {

    if (this.direction) {
      this.move(this.direction);
    }

    if (this.scene.pac) {

      this.setTurnPoint();
      this.centerGhost();
      
      if (!this.dead) {
        if (this.ghostReleased === true) {
          this.decideTarget();
  
          if (this.chaseTarget) {
            this.chasePac();
          }
        }
  
        if (!this.ghostReleased && this.unleashed) {
          this.speed = 30;
          this.releaseGhost();
        }
  
        if (this.vulnerable === true) {
          this.turnBlue();
        }
      }

      if (this.dead) {
        this.returnToCage();
      }
  
      //ghost wrap
      this.wrap();

      //UPDATE TILE POSITION
      this.updateTilePosition();
    }
  }

  move(direction) {
    this.createAnimation();

    if(this.dead){
      return this.anims.play("onlyEyes", true);
    }

    if (direction === "up") {
      this.anims.play("moveUp", true);
    } else if (direction === "down") {
      this.anims.play("moveDown", true);
    } else if (direction === "left") {
      this.anims.play("moveLeft", true);
    } else if (direction === "right") {
      this.anims.play("moveRight", true);
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

  findPac() {
    let count = 0;

    return function() {
      if (count >= 100) {
        count = 0;
        return this.lockOnTarget();
      } else {
        count += 1;
      }
    };
  }

  lockOnTarget() {
    const distancesToGhost = {};
    const playersAlive = this.scene.playersAlive;
    for (let playerNumber in playersAlive) {
      const distance = Phaser.Math.Between(
        playersAlive[playerNumber].tilePositionX,
        playersAlive[playerNumber].tilePositionY,
        this.tilePositionX,
        this.tilePositionY
      );
      distancesToGhost[distance] = playerNumber;
    }
    const shortestDistance = Math.min(...Object.keys(distancesToGhost));
    const closest = distancesToGhost[shortestDistance];

    if (
      playersAlive[closest] &&
      playersAlive[closest] !== this.chaseTarget
    ) {
      this.chaseTarget = playersAlive[closest];
    }
    return this.chaseTarget;
  }

  go(direction) {

    direction === "left" || direction === "up" ? (this.speed *= -1) : null;

    if (direction === "left" || direction === "right") {
      this.setVelocityX(this.speed);
      this.setVelocityY(0);
    }
    if (direction === "up" || direction === "down") {
      this.setVelocityY(this.speed);
      this.setVelocityX(0);
    }

    this.move(direction);
    this.direction = direction;
  }

  opposite(direction) {
    if(direction === "left") return "right";
    if(direction === "right") return "left";
    if(direction === "up") return "down";
    if(direction === "down") return "up";
  }

  directionsToPac(){

    const directionOptions = [];

    const targetTileX = this.chaseTarget.tilePositionX;

    const targetTileY = this.chaseTarget.tilePositionY;

    const ghostX = this.tilePositionX;

    const ghostY = this.tilePositionY;

    if (ghostX > targetTileX) {
      if (ghostY > 14 || ghostY < 0) {
        this.setVelocityX(0);
      } else {
        this.vulnerable ? directionOptions.push("right") : directionOptions.push("left");
      }
    }
    if (ghostX < targetTileX) {
      if (ghostY > 14 || ghostY < 0) {
        this.setVelocityX(0);
      } else {
        this.vulnerable ? directionOptions.push("left") : directionOptions.push("right");
      }
    }
    if (ghostY < targetTileY) {
      if (
        ghostY + (15 - targetTileY) <
        targetTileY - ghostY
      ) {
        this.vulnerable ? directionOptions.push("down") : directionOptions.push("up");
      } else {
        this.vulnerable ? directionOptions.push("up") : directionOptions.push("down");
      }
    }
    if (ghostY > targetTileY) {
      if (
        (15 - ghostY) + targetTileY <
        ghostY - targetTileY
      ) {
        this.vulnerable ? directionOptions.push("up") : directionOptions.push("down");
      } else {
        this.vulnerable ? directionOptions.push("down") : directionOptions.push("up");
      }
    }
    return directionOptions;
  }

  chasePac() {
    //if i am fuzzy 3 from the turnpoint and I am on a new tile
    const key = this.scene.path.buildKey(this.tilePositionY, this.tilePositionX);
    const mapPath = this.scene.path.adjacencyGraph[key];

    if (mapPath && this.fuzzyEqualXY(3) && this.scene.map.getTileAtWorldXY(this.x,this.y) !== this.previousTile) {

      const neighbors = mapPath.neighborsList;
      //if the tile i am on exists on the graph and the tile is a turn node
      if (mapPath.isTurnNode) {
        //find the options i have to move towards pac
        const directionOptions = this.directionsToPac();
        //to prevent from moving backwards
        //find index of the movement thats the opposite of my current direction
        const index = directionOptions.findIndex((direction)=> direction === this.opposite(this.direction));

        //if the index exists, take it off of the direction options
        if (index >= 0) {
          if(index === 0) {
            directionOptions.shift();
          }
          if(index === 1) {
            directionOptions.pop();
          }
        }

        //if the direction im currently moving in is not available, remove it as well
        if(!neighbors[this.direction]) {
          const indexOfCurrent = directionOptions.findIndex((direction)=> direction === this.direction);
          if (indexOfCurrent >= 0) {
            if(indexOfCurrent === 0) {
              directionOptions.shift();
            }
            if(indexOfCurrent === 1) {
              directionOptions.pop();
            }
          }
        }

        //if theres more than one direction option
        if (directionOptions.length > 1) {
          //and both direction options are available
          if (neighbors[directionOptions[0]] && neighbors[directionOptions[1]]) {
            //pick a direction at random
            let newDirection = directionOptions[Math.round(Math.random())];
            this.snapToTurnPoint();
            this.go(newDirection);
          }
          else{
            //else pick the option that is available.
            neighbors[directionOptions[0]] ? this.go(directionOptions[0]) : null;
            neighbors[directionOptions[1]] ? this.go(directionOptions[1]) : null;
          }
        }

        //else if the only direction in the options is available to move into, do so
        else if(neighbors[directionOptions[0]]){
          this.snapToTurnPoint();
          this.go(directionOptions[0]);
        }

        //if i hit a turn node and the direction i want to go in not available
        //pick a random direction that is not the direction i came
        if (directionOptions.length === 0) {

          for (let direction in neighbors){
            if (direction !== this.opposite(this.direction)) {
              directionOptions.push(direction);
            }
          }
          let newDirection = directionOptions[Math.round(Math.random())];
          this.snapToTurnPoint();
          this.go(newDirection);
        }
      }

      //account for corners
      else if (!mapPath.turnNode && !neighbors[this.direction]) {
        let newDirection = Object.keys(neighbors).find((direction)=> direction !== this.opposite(this.direction));
        if (Object.keys(neighbors).length < 2) newDirection = Object.keys(mapPath.neighborsList)[0];
        this.snapToTurnPoint();
        this.go(newDirection);
      }

      this.previousTile = this.scene.map.getTileAtWorldXY(this.x,this.y);

    }

  }

  centerGhost() {
    if (this.x !== this.turnPoint.x && this.body.velocity.y !== 0) {
      this.x = this.turnPoint.x;
    }
    if (this.y !== this.turnPoint.y && this.body.velocity.x !== 0) {
      this.y = this.turnPoint.y;
    } 
    else if (
      this.body.velocity.x === 0 &&
      this.body.velocity.y === 0 &&
      !this.fuzzyEqualXY(25) &&
      (!this.tilePositionY >= 15 || !this.tilePositionY <= -1)
    ) {
      this.snapToTurnPoint();
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
    this.scene.dangerZone = true;
    this.vulnerable = true;
  }
  flash() {
    this.createAnimation();
    this.anims.play("turnBlue", true);
    this.anims.play("turnWhite", true);
  }

  releaseGhost() {
    //when ghost has exited cage door
    if (this.tilePositionX === 15 && this.tilePositionY === 5 && this.fuzzyEqualXY(3)) {
      console.log('oh shit')
      this.direction = "";
      this.snapToTurnPoint();
      this.setVelocity(0,0);
      return this.ghostReleased = true;
    }

    else if (!Phaser.Math.Fuzzy.Equal(this.x, this.scene.map.tileToWorldX(15.571), 3)) {
      if(this.x > this.scene.map.tileToWorldX(15.571)) {
        return this.go("left");
      }
      if(this.x < this.scene.map.tileToWorldX(15.571)) {
        return this.go("right");
      }
    }

    else {
      this.go("up");
    }
  }

  pace() {

    this.speed = 100;
    if (!this.direction) {
      this.go("left");
    }
    if (Phaser.Math.Fuzzy.Equal(this.x, this.scene.map.tileToWorldX(14.5), 3)) {
      this.go("right");
    }
    if (Phaser.Math.Fuzzy.Equal(this.x, this.scene.map.tileToWorldX(16.57), 3)) {
      this.go("left");
    }
    else{
      this.go(this.direction)
    }
  }

  findFinalPath() {
    // A* search algorithm for shortest path
    // will be using Manhattan distance
    // G cost = distance from starting node
    // H cost = distance from target node
    // F cost = G + H;

    const open = [];
    const closed = [];

    this.updateTilePosition();

    this.startTileX = this.tilePositionX
    this.startTileY = this.tilePositionY

    this.startTileY === -1 ? this.startTileY = 0 : null;
    this.startTileY === 15 ? this.startTileY = 14 : null;

    const buildKey = this.scene.path.buildKey;
    const mapNodes = this.scene.path.adjacencyGraph;

    const startNode = mapNodes[buildKey(this.startTileY, this.startTileX)];

    open.push(startNode);

    const targetNode = mapNodes[buildKey(this.homeTileY, this.homeTileX)];

    let currentNode;
    while (currentNode !== targetNode) {

      // find node in open with lowest fcost
      let indexOfLowest = 0;
      for (let i = 1; i < open.length; ++i) {
        if (open[i].fCost < open[indexOfLowest].fCost) {
          indexOfLowest = i;
        }
      }

      currentNode = open[indexOfLowest];

      open.splice(indexOfLowest, 1);
      closed.push(currentNode);

      if (currentNode === targetNode) {
        break;
      }

      for(let key in currentNode.neighborsList){
        const neighbor = currentNode.neighborsList[key];
        const neighborNode = mapNodes[buildKey(neighbor.y, neighbor.x)];
        const fCost = this.fCost(neighborNode);
        if (closed.includes(neighborNode)) {
          continue;
        }
        const inOpen = open.includes(neighborNode);
        if (!inOpen || fCost < neighborNode.fCost) {
          neighborNode.prev = currentNode;
          neighborNode.direction = key;
          neighborNode.fCost = fCost;
          !inOpen ? open.push(neighborNode) : null;
        }
      }
    }

    const finalPath = [];

    let node = closed[closed.length - 1];
 
    while (node.prev) {
      finalPath.unshift(node);
      node = node.prev;
    }
    return this.finalPath = finalPath;
  }

  fCost(node){
    const {x, y} = node;
    const fCost = this.gCost(x, y, node) + this.hCost(x, y, node);
    return fCost;
  }

  gCost(x, y){
    const gCost = Math.abs(x - this.startTileX) + Math.abs(y - this.startTileY);
    return gCost;
  }
  hCost(x, y){
    const hCost = Math.abs(this.homeTileX - x) + Math.abs(this.homeTileY - y);
    return hCost;
  }

  returnToCage() {
    //journey home ^^ yay
    if (this.finalPath.length === 0) {
      this.ghostReleased = false;
      this.unleashed = false;
      this.chaseTarget = "";
      this.setVelocity(0,0);
      this.direction = "";
      this.scene.socket.emit("ghostRevival", socket.roomId);
      return this.dead = false;
    }
    if (this.tilePositionX === this.finalPath[0].x && this.tilePositionY === this.finalPath[0].y){
      return this.finalPath.shift();
    }
    else {
      this.go(this.finalPath[0].direction);
    }
  }

}
