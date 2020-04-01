export default function checkWin(scene) {
    const playersAlive = Object.keys(scene.playersAlive);
    if (playersAlive.length === 1) {
      console.log('WINNER: player', playersAlive[0]);
    }
  }