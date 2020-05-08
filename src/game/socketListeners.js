import addPlayer from "./addPlayer";
import addOtherPlayers from "./otherPlayers";
import { destroyInstructions } from "./instructions";
import { setUpFoodLayers } from "./setUpLayers";
let firstGame = true;
export let toggleSound = true;

export function listenForPlayerMovement(scene) {
  if(firstGame){
  scene.socket.on("playerMoved", (playerInfo) => {
    scene.otherPlayers.getChildren().forEach((otherPlayer) => {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        otherPlayer.big = playerInfo.big;
        otherPlayer.move(playerInfo.direction);
        otherPlayer.vulnerable = playerInfo.vulnerable;
        // if(!otherPlayer.moving){
        //   otherPlayer.createAnimations();
        //   otherPlayer.anims.play(`${otherPlayer.color}${otherPlayer.anims.currentAnim.key.slice(2)}`);
        //   // otherPlayer.anims.stopOnFrame(otherPlayer.anims.currentAnim.frames[1]);
        // }
      }
    });
  });
  }
}

export function listenForGhostMovement(scene) {
  if (firstGame) {
  scene.socket.on("ghostMove", (ghost) => {
    scene.og.vulnerable = ghost.vulnerable;
    scene.og.setPosition(ghost.x, ghost.y);
    scene.og.direction = ghost.direction;
    scene.og.wrap();
  });
  }
}

export function listenForGhostDeath(scene) {
  if (firstGame) {
    scene.socket.on("ghostDied", () => {
      scene.og.dead = true;
      if (toggleSound) {
        let eatGhostSound = scene.sound.add("eat_ghost");
        eatGhostSound.play();
      }
    });
  }
}

export function listenForVarious(scene) {
  if (firstGame) {
    scene.socket.on("ghostUnleashed", () => {
      scene.og.unleashed = true;
    });
    scene.socket.on("ghostAlive", ()=>{
      scene.og.dead = false;
    })
  }
}

export function listenForSomeonesDeath(scene) {
  if (firstGame) {
  scene.socket.on("someoneDied", (playerNumber) => {
    scene.playersAlive[playerNumber].dead = true;
  });
  }
}

export function listenForDotActivity(scene) {
  if (firstGame) {
  scene.socket.on("smallDotGone", (dots) => {
    let x = dots.x;
    let y = dots.y;
    scene.dots.getChildren().forEach((dot) => {
      if (dot.x === x && dot.y === y) {
        dot.destroy();
      }
    });
  });
  scene.socket.on("foodGone", (food) => {
    let x = food.x;
    let y = food.y;
    scene.food.getChildren().forEach((foodItem) => {
      if (foodItem.x === x && foodItem.y === y) {
        foodItem.destroy();
      }
    });
  });
  scene.socket.on("bigDotGone", (dots) => {
    let x = dots.x;
    let y = dots.y;
    scene.bigDots.getChildren().forEach((dot) => {
      if (dot.x === x && dot.y === y) {
        dot.destroy();
      }
    });
  });
  scene.socket.on("makeNewSmallDot", (dot) => {
    let x = dot.x;
    let y = dot.y;
    scene.dots.create(x, y, "smallDot");
  });
  scene.socket.on("makeNewBigDot", (dot) => {
    let x = dot.x;
    let y = dot.y;
    scene.bigDots.create(x, y, "largeDot");
  });
  scene.socket.on("makeNewFood", (food) => {
    let name = food.name;
    let x = food.x;
    let y = food.y;
    scene.food.create(x, y, name);
  });
  scene.socket.on("toggleSoundToPhaser", (toggle) => {
    if (toggle === "on") toggleSound = true;
    else toggleSound = false;
  });

  const startSound = scene.sound.add("game_start");
  scene.socket.on("sound", () => {
    if (toggleSound) {
      startSound.mute = false;
      scene.sound.add("intro").stop();
    } else {
      startSound.mute = true;
    }
  });
  }
}

export function listenForGameStart(scene) {
  if (firstGame) {
    firstGame = false;
    scene.socket.on("currentPlayers", (players) => {
      destroyInstructions(scene);
      setUpFoodLayers(scene);
      scene.countdown = scene.add.sprite(655, 280, "3");
      scene.anims.create({
        key: "countdown",
        frameRate: 1,
        frames: [{ key: "3" }, { key: "2" }, { key: "1" }, { key: "fight" }],
        repeat: 0,
      });
      scene.countdown.anims.play("countdown", true);
      scene.sound.play("game_start");
      scene.time.delayedCall(
        4000,
        () => {
          scene.countdown.destroy();
          Object.keys(players).forEach((playerId) => {
            if (playerId === scene.socket.id) {
              addPlayer(scene, players[playerId]);
            } else {
              addOtherPlayers(scene, players[playerId]);
            }
          });
        },
        [],
        scene
      );
    });
  }
}