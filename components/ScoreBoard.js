import React from "react";
import db from "../src/firebase";
import { socket } from "./App";

const ScoreBoard = props => {
  let players = props.players;
  let playersArr = Object.keys(props.players);
  let gameOver = props.gameOver;
  // let socket = props.socket;
  let gameCode = props.code;
  const games = db.collection("games");

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
          players[socket.id].playerNumber === 1 ? (
            <div key={socket.id}>
              <button onClick={() => props.startGame()}>Play Again?</button>
              <button
                className="exit-room-button"
                onClick={() => {
                  socket.emit("exitGameRoom", gameCode);
                  games.doc(gameCode).delete(); //removing game from db
                  window.location.reload(false);
                }}
              >
                Exit Game Room
              </button>
            </div>
          ) : (
            <button
              key={socket.id}
              className="exit-room-button"
              onClick={() => {
                socket.emit("exitGameRoom", gameCode);
                games.doc(gameCode).delete(); //removing game from db
                window.location.reload(false);
              }}
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
