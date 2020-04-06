import SmallPac from "./SmallPac.js";
import { socket } from "../../components/App";
import { toggleSound } from "./socketListeners";

export default function addPlayer(scene, player) {
  const playerNumber = player.playerNumber;
  const x = scene[playerNumber].startPositions.x;
  const y = scene[playerNumber].startPositions.y;
  let fruitSound = scene.sound.add("fruit");


  scene.pac = new SmallPac({
    scene: scene,
    x: scene.map.tileToWorldX(x),
    y: scene.map.tileToWorldY(y),
    key: `${scene[playerNumber].color}sclosed`,
    playerNumber: playerNumber
  });
  scene.pac.setScale(scene.collisionLayer.scale * 2.1); //.99
  scene.pac.tilePositionX = scene.map.worldToTileX(scene.pac.x);
  scene.pac.tilePositionY = scene.map.worldToTileY(scene.pac.y);

  scene.playersAlive[playerNumber] = scene.pac;

  scene.physics.add.collider(scene.pac, scene.collisionLayer, (pac, layer) => {
    pac.setVelocity(0, 0);
    pac.direction = "";
    pac.setTurnPoint();
    pac.snapToTurnPoint();
    // pac.moving = false;
    //had to take it cause because it was throwing an error on player2, could not read frames
    // pac.anims.stopOnFrame(pac.anims.currentAnim.frames[1]);
  });
  
  scene.physics.add.overlap(scene.pac, scene.otherPlayers, (pac, other) => {
    if (!pac.big && other.big) {
      pac.dead = true;
    } 
    if (pac.big === other.big) {
      pac.direction === "left" ? pac.collisionDirection = "right" : null;
      pac.direction === "right" ? pac.collisionDirection = "left" : null;
      pac.direction === "up" ? pac.collisionDirection = "down" : null;
      pac.direction === "down" ? pac.collisionDirection = "up" : null;

      if (!pac.direction) {
        pac.body.touching.left === true ? pac.collisionDirection = "right" : null;
        pac.body.touching.right === true ? pac.collisionDirection = "left" : null;
        pac.body.touching.up === true ? pac.collisionDirection = "down" : null;
        pac.body.touching.down === true? pac.collisionDirection = "up" : null;
      }

      pac.colliding = true;
      pac.direction = "";
      setTimeout(() => {
        pac.setVelocity(0, 0);
        pac.colliding = false
        pac.collisionDirection = "";
      }, 320);
    }
  });
  scene.physics.add.overlap(scene.pac, scene.og, () => {
    if (!scene.pac.big && scene.og.vulnerable === false) {
      scene.pac.dead = true;
    } else {
      scene.og.dead = true;
      setTimeout(()=> {
        scene.og.x = scene.map.tileToWorldX(15.571),
        scene.og.y = scene.map.tileToWorldY(7.56),
        scene.og.enableBody(true, scene.map.tileToWorldX(15.571), scene.map.tileToWorldY(7.56), true, true);
        scene.og.dead = false;
        scene.chaseTarget = "";  
      }, 30000);
    }
  });
  scene.physics.add.overlap(scene.pac, scene.dots, (pac, dots) => {
    scene.socket.emit("ateSmallDot", { x: dots.x, y: dots.y }, socket.roomId);
    dots.destroy();
    if (toggleSound) {
      let eatSound = scene.sound.add("eat");
      eatSound.play();
    }
  });
  scene.physics.add.overlap(scene.pac, scene.food, (pac, food) => {
    scene.socket.emit("ateFood", { x: food.x, y: food.y }, socket.roomId);
    food.destroy();
    if (toggleSound) {
      fruitSound.play();
    }

    //if remaining food length is zero
    if (scene.food.getChildren().length === 0) {
      function callFood() {
        const allFood = [
          "banana",
          "cakeSlice",
          "papaya",
          "burger",
          "peach",
          "egg",
          "pizzaSlice",
          "candy"
        ];
        const randomFood = allFood[Math.floor(Math.random() * allFood.length)];
        return randomFood;
      }

      scene.collisionLayerFoodDots.forEachTile(tile => {
        if (tile.index === 9) {
          const x = tile.getCenterX();
          const y = tile.getCenterY();
          const dot = scene.dots.create(x, y, "smallDot");
          scene.socket.emit(
            "newSmallDot",
            { x: dot.x, y: dot.y },
            socket.roomId
          );
        }
      });

      //large dots
      scene.collisionLayerFoodDots.forEachTile(tile => {
        if (tile.index === 5) {
          const x = tile.getCenterX();
          const y = tile.getCenterY();

          if (x === 862.4 && y === 145.6) {
            const dot = scene.bigDots.create(x, y, "largeDot");
            scene.socket.emit(
              "newBigDot",
              { x: dot.x, y: dot.y },
              socket.roomId
            );
          } else if (x === 442.4 && y === 481.6) {
            const dot = scene.bigDots.create(x, y, "largeDot");
            scene.socket.emit(
              "newBigDot",
              { x: dot.x, y: dot.y },
              socket.roomId
            );
          }
        }
      });

      scene.collisionLayerFoodDots.forEachTile(tile => {
        if (tile.index === 6 || tile.index === 7 || tile.index === 8) {
          const x = tile.getCenterX();
          const y = tile.getCenterY();
          const foodItem = scene.food.create(x, y, callFood());
          scene.socket.emit(
            "newFood",
            { name: foodItem.texture.key, x: foodItem.x, y: foodItem.y },
            socket.roomId
          );
        }
      });

      //food destroyed after renewed
      scene.physics.add.overlap(scene.pac, scene.food, (pac, food) => {
        scene.socket.emit("ateFood", { x: food.x, y: food.y }, socket.roomId);
        food.destroy();
        if (toggleSound) fruitSound.play();
      });
    }
  });

  scene.physics.add.overlap(scene.pac, scene.bigDots, (pac, dots) => {
    scene.socket.emit("ateBigDot", { x: dots.x, y: dots.y }, socket.roomId);
    dots.destroy();
    if (toggleSound) {
      let powerPelletSound = scene.sound.add("powerPellet", 2);
      powerPelletSound.play();
    }

    scene.og.vulnerable = true;
    pac.big = true;
    pac.vulnerable = false;
    scene.time.delayedCall(
      5000,
      () => {
        scene.og.vulnerable = false;
        scene.pac.big = false;
        scene.pac.vulnerable = true;
      },
      [],
      scene
    );
  });
}
