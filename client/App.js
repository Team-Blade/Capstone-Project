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
      players: [],
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

    this.setState({
      buttonClicked: false,
      name: "",
      buttonClickedName: "create",
      code,
    });

    //sending player to database
    let name = this.state.name;
    let players = {};
    players[name] = { score: 0 };
    games.doc(code).set({ players }, { merge: true });

    socket.emit("createRoom", code);
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  joinGame() {
    let name = this.state.name;
    let code = this.state.code;

    //sending player to database
    let players = {};
    players[name] = { score: 0 };
    games.doc(code).set({ players }, { merge: true });
    games.doc(code).onSnapshot((doc) => {
      const players = Object.keys(doc.data().players);
      this.setState({ players });
    });

    socket.emit("joinRoom", code);
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  startGame() {
    games.doc(this.state.code).onSnapshot((doc) => {
      const players = Object.keys(doc.data().players);
      this.setState({ buttonClickedName: "", players });
      socket.emit("startGame", this.state.code);
    });
  }

  render() {
    return (
      <div id="main-wrapper">
        <main id="main">
          <nav>
            {/* <div></div> */}
            {/* {this.state.players.length > 0 ? (
              <ScoreBoard players={this.state.players}></ScoreBoard>
            ) : null} */}
          </nav>
          <div>
            {!this.state.beginGameButtonClicked ? (
              <Popup defaultOpen>
                <div id="container-start">
                  <div></div>
                  <img className="logo" src="/public/assets/DotEaterLogo.png" />
                  <button
                    className="start-button"
                    onClick={() =>
                      this.setState({
                        beginGameButtonClicked: true,
                        buttonClicked: true,
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
              <Popup open>
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
                      onChange={this.handleNameChange}
                      required
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
                          buttonClickedName: "join",
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
            <Popup open>
              <div className="init-game">
                <div>
                  <p>Game code:</p>
                  <br />
                  <h2>{this.state.code}</h2>
                </div>
                <button
                  className="start-button"
                  type="submit"
                  onClick={this.startGame}
                  open={false}
                >
                  START!
                </button>
              </div>
            </Popup>
          ) : null}

          {/* Popup for game joiners */}
          {this.state.buttonClickedName === "join" ? (
            <Popup open>
              <div className="init-game">
                <input
                  type="text"
                  placeholder="Game Code Here"
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
