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
      players: {},
      gameStarted: false,
      gameOver: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.eventListener = this.eventListener.bind(this);
  }
  componentDidMount() {
    this.eventListener();
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
    socket.on("invalidRoom", roomId => {
      console.log("inside invalidRoom");
      alert("Sorry, game room:", roomId, "not found");
    });
    socket.on("gameAlreadyStarted", roomId => {
      alert(`Sorry, the game for code ${roomId} has already started...`);
      window.location.reload(false);
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
    this.setState({
      buttonClickedName: "",
      gameOver: false,
      gameStarted: true
    });
    socket.emit("startGame", this.state.code);
  }
  restartGame() {
    this.setState({ buttonClickedName: "", gameOver: false });
    socket.emit("restartGame", this.state.code);
  }

  eventListener() {
    socket.on("playAgain", () => {
      this.setState({ gameOver: true });
    });
  }

  render() {
    let state = this.state;
    return (
      <div id="main-wrapper">
        <main id="main">
          <nav>
            <ScoreBoard
              players={state.players}
              gameOver={state.gameOver}
              socket={socket}
              startGame={this.startGame}
            />
            {this.state.buttonClickedName === "create" ? (
              <div id="game-start">
                <p>
                  Wait for all
                  <br />
                  players...
                </p>
                <button
                  className="start-game-button"
                  type="submit"
                  onClick={this.startGame}
                  open={false}
                >
                  START!
                </button>
              </div>
            ) : null}
            {state.buttonClickedName !== "" &&
            state.buttonClickedName !== "create" &&
            !state.gameStarted ? (
              <p className="waiting-room">
                Waiting for <br /> game to start...
              </p>
            ) : null}
          </nav>
          <div>
            {!state.beginGameButtonClicked ? (
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

            {state.buttonClicked ? (
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
                      disabled={!state.name}
                      onClick={this.createGame}
                    >
                      Create A Game
                    </button>

                    {/* Join Game */}
                    <button
                      type="button"
                      name="join"
                      disabled={!state.name}
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
                    <div>Share this code</div>
                    <br />
                    with friends
                    <div>
                      <h2>{state.code}</h2>
                    </div>
                  </div>
                  <button
                    className="enter-game-button"
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
