export default function checkWin(scene) {
  const playersAlive = Object.keys(scene.playersAlive);
  if (playersAlive.length === 1) {
    scene.winner = `player${playersAlive[0]}`;
    console.log("WINNER:", scene.winner);
    scene.add.image(760, 280, `${scene.winner}`);
    scene.time.delayedCall(
      5000,
      () => {
        scene.socket.emit("gameOver", scene.socket.roomId);
        scene.playersAlive = {};
        scene.otherPlayers.clear(true, true);
        scene.pac.dead = true;
        scene.pac.destroy();
        scene.winner = "";
        scene.gameOver = true;
        scene.otherPlayersArray = [];
        scene.scene.restart();
      },
      [],
      scene
    );

    return true;
  } else {
    return false;
  }
}
