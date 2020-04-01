import React from "react";
import Popup from "reactjs-popup";
import ScoreBoard from "./ScoreBoard";
import db from "../src/firebase";

export const socket = io();
const games = db.collection("games");

const randomString = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
  const codeLength = 4;
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
      beginGameButtonClicked: false,
      buttonClicked: false,
      name: "",
      buttonClickedName: "",
      code: "",
      players: {}
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleCodeChange(event) {
    this.setState({ code: event.target.value });
  }

  createGame() {
    //generate a game code
    const code = randomString();
    let name = this.state.name;
    socket.emit("createRoom", code, name);
    //sending player to database & updating state
    socket.on("newPlayers", allPlayers => {
      games.doc(code).set({ players: allPlayers }, { merge: true });
      this.setState({
        buttonClicked: false,
        name: "",
        buttonClickedName: "create",
        code,
        players: allPlayers
      });
    });
    //listening for new players
    games.doc(code).onSnapshot(doc => {
      const players = doc.data().players;
      this.setState({ players });
    });
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  joinGame() {
    let name = this.state.name;
    let code = this.state.code;

    socket.emit("joinRoom", code, name);
    socket.on("gameAlreadyStarted", roomId => {
      alert("Sorry, the game for this code has already started...");
    });

    socket.on("newPlayers", allPlayers => {
      games.doc(code).set({ players: allPlayers }, { merge: true });
    });
    //listening for new players
    games.doc(code).onSnapshot(doc => {
      const players = doc.data().players;
      this.setState({ players });
    });
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  startGame() {
    this.setState({ buttonClickedName: "" });
    socket.emit("startGame", this.state.code);
  }

  render() {
    return (
      <div id="main-wrapper">
        <main id="main">
          <nav>
            <ScoreBoard players={this.state.players}></ScoreBoard>
            {this.state.buttonClickedName === "create" ? (
              <button
                className="start-button"
                type="submit"
                onClick={this.startGame}
                open={false}
              >
                START!
              </button>
            ) : null}
          </nav>
          <div>
            {!this.state.beginGameButtonClicked ? (
              <Popup defaultOpen closeOnDocumentClick={false}>
                <div id="container-start">
                  <div></div>
                  <img
                    className="logo"
                    src="/public/assets/extract/Menu_rogo.png"
                  />
                  <button
                    className="start-button"
                    onClick={() =>
                      this.setState({
                        beginGameButtonClicked: true,
                        buttonClicked: true
                      })
                    }
                  >
                    CLICK TO BEGIN
                  </button>
                  <div></div>
                </div>
              </Popup>
            ) : null}

            {this.state.buttonClicked ? (
              <Popup open closeOnDocumentClick={false}>
                <div className="input-buttons">
                  <div>
                    <h4>Enter Name:</h4>
                  </div>
                  <div>
                    {/* Input for player Name */}
                    <input
                      type="text"
                      name="name"
                      placeholder="Player Name"
                      maxLength="8"
                      onChange={this.handleNameChange}
                      required={(true, "Name is required")}
                    />
                  </div>
                  <div>
                    {/* Create Game */}
                    <button
                      type="submit"
                      name="create"
                      disabled={!this.state.name}
                      onClick={this.createGame}
                    >
                      Create A Game
                    </button>

                    {/* Join Game */}
                    <button
                      type="button"
                      name="join"
                      disabled={!this.state.name}
                      onClick={() =>
                        this.setState({
                          buttonClicked: false,
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

          {/* Popup for game creator */}
          {this.state.buttonClickedName === "create" ? (
            <Popup open closeOnDocumentClick={false}>
              {close => (
                <div className="init-game-create">
                  <div>
                    <p>Game code:</p>
                    <br />
                    <h2>{this.state.code}</h2>
                  </div>
                  <button
                    onClick={() => {
                      close();
                    }}
                  >
                    Enter Game Room
                  </button>
                </div>
              )}
            </Popup>
          ) : null}

          {/* Popup for game joiners */}
          {this.state.buttonClickedName === "join" ? (
            <Popup open closeOnDocumentClick={false}>
              <div className="init-game">
                <input
                  type="text"
                  placeholder="Game Code Here"
                  maxLength="4"
                  onChange={() => this.handleCodeChange(event)}
                />
                <button
                  onClick={() => {
                    this.joinGame();
                    this.setState({ buttonClickedName: "" });
                  }}
                >
                  Enter Game
                </button>
              </div>
            </Popup>
          ) : null}
        </main>
      </div>
    );
  }
}

export default App;
