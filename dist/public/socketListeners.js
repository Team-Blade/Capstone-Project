
export function listenForPlayerMovement(scene){
  scene.socket.on("playerMoved", playerInfo => {
    scene.otherPlayers.getChildren().forEach(otherPlayer => {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        otherPlayer.big = playerInfo.big;
        otherPlayer.move(playerInfo.direction);
        otherPlayer.vulnerable = playerInfo.vulnerable;
      }
    });
  });
}
  
export function listenForGhostMovement(scene) {
  scene.socket.on("ghostMove", ghost => {
  scene.og.vulnerable = ghost.vulnerable;
  scene.og.setPosition(ghost.x, ghost.y);
  scene.og.move(ghost.direction);
  scene.og.wrap();
  });

}

export function listenForGhostDeath (scene) {
  scene.socket.on("ghostDied", ()=> {
    scene.og.dead = true;
  })
}

export function listenForDotActivity (scene) {
  scene.socket.on("smallDotGone", dots => {
    let x = dots.x;
    let y = dots.y;
    scene.dots.getChildren().forEach(dot => {
      if (dot.x === x && dot.y === y) {
        dot.destroy();
      }
    });
  });
  scene.socket.on("foodGone", food => {
    let x = food.x;
    let y = food.y;
    scene.food.getChildren().forEach(foodItem => {
      if (foodItem.x === x && foodItem.y === y) {
        foodItem.destroy();
      }
    });
  });
  scene.socket.on("bigDotGone", dots => {
    let x = dots.x;
    let y = dots.y;
    scene.bigDots.getChildren().forEach(dot => {
      if (dot.x === x && dot.y === y) {
        dot.destroy();
      }
    });
  });
}