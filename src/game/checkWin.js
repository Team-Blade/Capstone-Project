export default function checkWin(scene) {
  const playersAlive = Object.keys(scene.playersAlive);
  if (playersAlive.length === 1) {
    scene.winner = `player${playersAlive[0]}`;
    console.log("WINNER:", scene.winner);
    scene.add.image(760, 280, `${scene.winner}`);
    scene.socket.emit("gameOver", scene.socket.roomId);
    scene.pac = false;
    scene.playersAlive = {};
    scene.winner = "";
    scene.scene.restart();

    return true;
  } else {
    return false;
  }
}
