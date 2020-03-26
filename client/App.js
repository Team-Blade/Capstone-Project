import React from "react";
import Popup from "reactjs-popup";
import Game from "./Game";
import db from "../src/firebase";

export const socket = io();
const games = db.collection("games");

const randomString = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
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
    this.setState({
      buttonClicked: true,
      name: "",
      buttonClickedName: "create",
      code
    });

    let name = this.state.name;
    let players = {};
    players[name] = { score: 0 };
    games.doc(code).set({ players }, { merge: true });
    socket.emit("createRoom", code);
    alert(`Share your game code: ${code}`);
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  joinGame() {
    let name = this.state.name;
    let code = this.state.code;
    let players = {};
    players[name] = { score: 0 };
    games.doc(code).set({ players }, { merge: true });

    socket.emit("joinRoom", code);
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  render() {
    return (
      <div id="main-wrapper">
        <main id="main">
          <nav>
            <img className="logo" src="/public/assets/extract/Menu_rogo.png" />
          </nav>
          <div>
            {!this.state.buttonClicked ? (
              <Popup
                trigger={
                  <div id="container-start">
                    <button className="start-button"> CLICK TO BEGIN </button>
                  </div>
                }
                modal
              >
                <div className="input-buttons">
                  <div>
                    <h4>Enter Name:</h4>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Player Name"
                      onChange={this.handleNameChange}
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      name="create"
                      disabled={!this.state.name}
                      onClick={() => this.createGame()}
                    >
                      Create A Game
                    </button>

                    <button
                      type="button"
                      name="join"
                      disabled={!this.state.name}
                      onClick={() =>
                        this.setState({
                          buttonClicked: true,
                          buttonClickedName: "join"
                        })
                      }
                    >
                      Join A Game
                    </button>
                  </div>
                </div>
              </Popup>
            ) : null}
          </div>

          {this.state.buttonClickedName === "create" ? (
            <div className="init-game">
              <button
                className="start-button"
                type="submit"
                onClick={() => {
                  socket.emit("startGame", this.state.code);
                }}
              >
                START!
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
