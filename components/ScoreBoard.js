import React from "react";

const ScoreBoard = props => {
  let players = props.players;
  let playersArr = Object.keys(props.players);
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
    </div>
  );
};

export default ScoreBoard;
