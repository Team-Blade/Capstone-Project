import React from "react";
import db from "../src/firebase";

const ScoreBoard = props => {
  console.log(props.players);
  return (
    <div id="player-container">
      <h6>PLAYERS: </h6>
      <ul>
        {props.players.map(player => {
          <li>{player}</li>;
        })}
      </ul>
    </div>
  );
};

export default ScoreBoard;
