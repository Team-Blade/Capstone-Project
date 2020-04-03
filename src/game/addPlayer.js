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
  scene.physics.add.collider(scene.pac, scene.otherPlayers, (pac, other) => {
    if (!pac.big && other.big) {
      pac.dead = true;
      // pac.disableBody(true, true)
      // delete scene.playersAlive[pac.playerNumber]
    }
    else {
    }
  });
  scene.physics.add.overlap(scene.pac, scene.og, () => {
    if (!scene.pac.big && scene.og.vulnerable === false) {
      scene.pac.dead = true;
      // scene.pac.disableBody(true, true);
      // delete scene.playersAlive[scene.pac.playerNumber];
    } else {
      scene.og.dead = true;
    }
  });
  scene.physics.add.overlap(scene.pac, scene.dots, (pac, dots) => {
    scene.socket.emit("ateSmallDot", { x: dots.x, y: dots.y }, socket.roomId);
    dots.destroy();
    let eatSound = scene.sound.add('eat')
    eatSound.play();
  });
  scene.physics.add.overlap(scene.pac, scene.food, (pac, food) => {
    scene.socket.emit("ateFood", { x: food.x, y: food.y }, socket.roomId);
    food.destroy();
    let fruitSound = scene.sound.add('fruit')
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
        }
      });

      //large dots
      scene.collisionLayerFoodDots.forEachTile(tile => {
        if (tile.index === 5) {
          const x = tile.getCenterX();
          const y = tile.getCenterY();

          if (x === 862.4 && y === 145.6) {
            const dot = scene.bigDots.create(x, y, "largeDot");
          } else if (x === 442.4 && y === 481.6) {
            const dot = scene.bigDots.create(x, y, "largeDot");
          }
        }
      });

      scene.collisionLayerFoodDots.forEachTile(tile => {
        if (tile.index === 6 || tile.index === 7 || tile.index === 8) {
          const x = tile.getCenterX();
          const y = tile.getCenterY();
          const foodItem = scene.food.create(x, y, callFood());
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
    let powerPelletSound = scene.sound.add('powerPellet',2)
    powerPelletSound.play();
    powerPelletSound.setRate(0.35)

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
