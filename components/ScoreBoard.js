import React from "react";

const ScoreBoard = props => {
  let players = props.players;
  let playersArr = Object.keys(props.players);
  let gameOver = props.gameOver;
  let socketId = props.socket.id;
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
        {gameOver ? (
          players[socketId].playerNumber === 1 ? (
            <div key={socketId}>
              <button onClick={() => props.startGame()}>Play Again?</button>
              <button
                id="exit-room-button"
                onClick={() => window.location.reload(false)}
              >
                Exit Game Room
              </button>
            </div>
          ) : (
            <button
              key={socketId}
              onClick={() => window.location.reload(false)}
            >
              Exit Game Room
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default ScoreBoard;
