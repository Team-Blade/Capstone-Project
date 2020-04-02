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

  scene.physics.add.collider(scene.pac, scene.collisionLayer, (pac, layer) => {
    pac.moving = false;
    //had to take it cause because it was throwing an error on player2, could not read frames
    // pac.anims.stopOnFrame(pac.anims.currentAnim.frames[1]);
  });
  scene.physics.add.collider(scene.pac, scene.otherPlayers, (pac, other) => {
    if (!pac.big && other.big) {
      pac.dead = true;
      // pac.disableBody(true, true)
      // delete scene.playersAlive[pac.playerNumber]
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
    scene.socket.emit(
      "ateSmallDot",
      { x: dots.x, y: dots.y },
      socket.roomId
    );
    dots.destroy();
  });
  scene.physics.add.overlap(scene.pac, scene.food, (pac, food) => {
    scene.socket.emit("ateFood", { x: food.x, y: food.y }, socket.roomId);
    food.destroy();
  });
  scene.physics.add.overlap(scene.pac, scene.bigDots, (pac, dots) => {
    scene.socket.emit("ateBigDot", { x: dots.x, y: dots.y }, socket.roomId);
    dots.destroy();
    pac.big = true;
    pac.vulnerable = false
    scene.og.vulnerable = true;
    scene.time.delayedCall(
      5000,
      () => {
        scene.pac.big = false;
        scene.pac.vulnerable = true;
        scene.og.vulnerable = false;
        // console.log(scene.pac.big, scene.pac.vulnerable, scene.og.vulnerable);
      },
      [],
      scene
    );
  });
}
