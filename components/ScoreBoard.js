import React from "react";

const ScoreBoard = props => {
  let players = props.players;
  let playersArr = Object.keys(props.players);
  let gameOver = props.gameOver;
  return (
    <div id="player-container">
      <h3>PLAYERS: </h3>
      <div id="players">
        <ul>
          {playersArr.map(player => {
            console.log(player);
            return (
              <li key={player} id={`player${players[player].playerNumber}`}>
                {players[player].name}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        {gameOver
          ? playersArr.map(player => {
              let playerId = players[player].playerNumber;
              if (playerId === 1) {
                console.log(props.startGame);
                return (
                  <div key={playerId}>
                    <button onClick={() => props.restartGame()}>
                      Play Again?
                    </button>
                    <button onClick={() => window.location.reload(false)}>
                      Exit Game Room
                    </button>
                  </div>
                );
              }
            })
          : null}
      </div>
    </div>
  );
};

export default ScoreBoard;
