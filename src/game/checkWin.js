import { socket } from "../../components/App";

export default function checkWin(scene) {
  const playersAlive = Object.keys(scene.playersAlive);
  if (scene.gameOver && scene.pac.dead) {
    console.log(scene.gameOver, 'game over')
    return true;
  }
  if (playersAlive.length === 1 && socket.roomId.slice(-4) !== "DEMO") {
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
  }

  if (scene.pac && playersAlive.length === 0 && socket.roomId.slice(-4) === "DEMO") {
    console.log('theres a pac, players alive length is 0, is a demo')
    scene.time.delayedCall(
      1000,
      () => {
        console.log('delayed call');
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
  }
  else {
    scene.gameOver = false;
    return false;
  }
}
