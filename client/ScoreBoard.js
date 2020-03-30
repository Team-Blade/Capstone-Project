import React from "react";

const ScoreBoard = props => {
  let count = 0;
  let players = props.players.reverse();
  return (
    <div id="player-container">
      <h3>PLAYERS: </h3>
      <div id="players">
        {/* <ul>
          <li id="yellow-player">Yellow</li>
          <li id="red-player">Red</li>
          <li id="blue-player">Blue</li>
          <li id="pink-player">Pink</li>
        </ul> */}
        <ul>
          {players.map(player => {
            count++;
            return <li key={player}>{player}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default ScoreBoard;
