import React from "react";
import Popup from "reactjs-popup";

const ScoreBoard = props => {
  let count = 0;
  let players = props.players.reverse();
  return (
    // <Popup open closeOnDocumentClick={false} position="right">
    <div id="player-container">
      <h3>PLAYERS: </h3>
      <ul>
        {players.map(player => {
          count++;
          return <li key={player}>{player}</li>;
        })}
      </ul>
    </div>
    // </Popup>
  );
};

export default ScoreBoard;
