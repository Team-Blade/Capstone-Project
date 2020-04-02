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
                return (
                  <div key={playerId}>
                    <button onClick={() => props.startGame()}>
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
