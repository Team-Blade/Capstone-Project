import SmallPac from "./SmallPac.js";
import { socket } from "../../components/App";

export default function addPlayer(scene, player) {
  const playerNumber = player.playerNumber;
  const x = scene[playerNumber].startPositions.x;
  const y = scene[playerNumber].startPositions.y;

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

  scene.physics.add.overlap(scene.pac, scene.collisionLayer, (pac, layer) => {
    pac.setVelocity(0, 0);
    // pac.moving = false;
    //had to take it cause because it was throwing an error on player2, could not read frames
    // pac.anims.stopOnFrame(pac.anims.currentAnim.frames[1]);
  });
  
  scene.physics.add.overlap(scene.pac, scene.otherPlayers, (pac, other) => {
    if (!pac.big && other.big) {
      pac.dead = true;
    } 
    else{
      console.log('trying with 4 tiles')
      if ((pac.direction === "right" || (!pac.direction && other.direction === "left")) && !pac['tileleft'].collides) {
        // for (let i = 4; i > 0; i--) {
        //   console.log(i, scene.map.getTileAt(pac.tilePositionX - i, pac.tilePositionY, false, "mapBaseLayer").collides);
        //   if (!scene.map.getTileAt(pac.tilePositionX - i, pac.tilePositionY, false, "mapBaseLayer").collides) {
        //     // pac.x = scene.map.tileToWorldX(pac.tilePositionX - i + 0.57);
        //     pac.colliding = true;
        //     pac.body.velocity.x = -1000;
        //     console.log
        //     setTimeout(()=> {
        //       pac.colliding = false;
        //       pac.direction = "";
        //       pac.setVelocity(0, 0);
        //     }, 1000);
        //     break;
        //   }
        // }
        pac.x = scene.map.tileToWorldX(pac.tilePositionX - 1 + 0.57);
      }
      if ((pac.direction === "left" || (!pac.direction && other.direction === "right")) && !pac['tileright'].collides) {
        pac.x = scene.map.tileToWorldX(pac.tilePositionX + 1 + 0.57);
      }
      if ((pac.direction === "down" || (!pac.direction && other.direction === "up")) && !pac['tileup'].collides) {
        pac.y = scene.map.tileToWorldY(pac.tilePositionY - 1 + 0.57);
      }
      if ((pac.direction === "up" || (!pac.direction && other.direction === "down")) && !pac['tiledown'].collides) {
        pac.y = scene.map.tileToWorldY(pac.tilePositionY + 1 + 0.57);
      }
      // pac.direction === "right" && !pac['tileleft'].collides ? pac.x = scene.map.tileToWorldX(pac.tilePositionX - 1 + 0.57) : null;
      // pac.direction === "left" && !pac['tileright'].collides ? pac.x = scene.map.tileToWorldX(pac.tilePositionX + 1 + 0.57) : null;
      // pac.direction === "down" && !pac['tileup'].collides ? pac.y = scene.map.tileToWorldY(pac.tilePositionY - 1 + 0.57) : null;
      // pac.direction === "up" && !pac['tiledown'].collides ? pac.y = scene.map.tileToWorldY(pac.tilePositionY + 1 + 0.57) : null;
      pac.setVelocity(0, 0);
      pac.direction = "";
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
      }, 10000);
    }
  });
  scene.physics.add.overlap(scene.pac, scene.dots, (pac, dots) => {
    scene.socket.emit("ateSmallDot", { x: dots.x, y: dots.y }, socket.roomId);
    dots.destroy();
    let eatSound = scene.sound.add("eat");
    eatSound.play();
  });
  scene.physics.add.overlap(scene.pac, scene.food, (pac, food) => {
    scene.socket.emit("ateFood", { x: food.x, y: food.y }, socket.roomId);
    food.destroy();
    let fruitSound = scene.sound.add("fruit");
    fruitSound.play();

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
        fruitSound.play();
      });
    }
  });

  scene.physics.add.overlap(scene.pac, scene.bigDots, (pac, dots) => {
    scene.socket.emit("ateBigDot", { x: dots.x, y: dots.y }, socket.roomId);
    dots.destroy();
    let powerPelletSound = scene.sound.add("powerPellet", 2);
    powerPelletSound.play();

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
