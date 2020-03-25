import React from "react";
import Game from "./Game";
import db from "../src/firebase";

export const socket = io();
const games = db.collection("games");

const randomString = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const codeLength = 5;
  let randomCode = "";
  for (let i = 0; i < codeLength; i++) {
    let randoNum = Math.floor(Math.random() * chars.length);
    randomCode += chars.substring(randoNum, randoNum + 1);
  }
  return randomCode;
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      buttonClicked: false,
      name: "",
      buttonClickedName: "",
      code: ""
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }
  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleCodeChange(event) {
    this.setState({ code: event.target.value });
  }

  createGame() {
    const code = randomString();
    this.setState({ buttonClicked: true, buttonClickedName: "create", code });

    let name = this.state.name;
    let players = {};
    players[name] = { score: 0 };
    games.doc(code).set({ players }, { merge: true });

    console.log(socket.id);
    socket.emit("createRoom", code);
    alert(`Share your game code: ${code}`);
  }

  joinGame() {
    let name = this.state.name;
    let code = this.state.code;
    let players = {};
    players[name] = { score: 0 };
    games.doc(code).set({ players }, { merge: true });

    socket.emit("joinRoom", code);
    // socket.emit("startGame", this.state.code);
  }

  render() {
    return (
      <div id="main-wrapper">
        <main id="main">
          <h1>Pac Man Battle Royal</h1>

          {!this.state.buttonClicked ? (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Player Name"
                onChange={this.handleNameChange}
                required
              />
              <button
                type="button"
                name="create"
                onClick={() => this.createGame()}
              >
                Create Game
              </button>
              <button
                type="button"
                name="join"
                onClick={() =>
                  this.setState({
                    buttonClicked: true,
                    buttonClickedName: "join"
                  })
                }
              >
                Join Game
              </button>
            </div>
          ) : null}

          {this.state.buttonClickedName === "create" ? (
            <div className="init-game">
              <button
                type="submit"
                onClick={() => {
                  socket.emit("startGame", this.state.code);
                }}
              >
                Start Game
              </button>
            </div>
          ) : null}

          {this.state.buttonClickedName === "join" ? (
            <div className="init-game">
              <input
                type="text"
                placeholder="Game Code Here"
                onChange={() => this.handleCodeChange(event)}
              />
              <button onClick={() => this.joinGame()}>Enter Game</button>
            </div>
          ) : null}
          <div id="score-board"></div>
        </main>
      </div>
    );
  }
}

export default App;
