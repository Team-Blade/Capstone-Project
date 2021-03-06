import React from "react";
import Popup from "reactjs-popup";
import ScoreBoard from "./ScoreBoard";
import db from "../src/firebase";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Dot } from 'react-animated-dots';

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
      placeholderName: "Player Name",
      buttonClickedName: "",
      code: "",
      players: {},
      gameStarted: false,
      gameOver: false,
      waitingRoom: false,
      alertCopied: false,
      sound: true,
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.eventListener = this.eventListener.bind(this);
    this.copied = this.copied.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
    this.startDemo = this.startDemo.bind(this);
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
  createGame(code = this.state.code) {
    //generate a game code
    // const code = this.state.code;
    let name = this.state.name;

    socket.emit("createRoom", code, name);
    //sending player to database & updating state
    socket.on("newPlayers", (allPlayers) => {
      games.doc(code).set({ players: allPlayers }, { merge: true });
      this.setState({
        name: "",
        players: allPlayers,
      });
    });
    //listening for new players
    games.doc(code).onSnapshot((doc) => {
      const players = doc.data().players;
      this.setState({ players });
    });
    // store the room id in the socket for future use
    socket.roomId = code;
  }

  startDemo() {
    const code = randomString().concat("DEMO");
    this.setState({
      buttonClicked: false,
      buttonClickedName: "",
      gameOver: false,
      gameStarted: true,
      code,
    });
    this.createGame(code);

    setTimeout(()=>{socket.emit("startGame", code)}, 1500);
    
  }

  joinGame() {
    let name = this.state.name;
    let code = this.state.code.toUpperCase();

    socket.emit("joinRoom", code, name);
    socket.on("newPlayers", (allPlayers) => {
      games.doc(code).set({ players: allPlayers }, { merge: true });
    });

    //listening for new players
    games.doc(code).onSnapshot((doc) => {
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
      gameStarted: true,
    });
    socket.emit("startGame", this.state.code);
  }
  toggleSound(toggle) {
    socket.emit("toggleSoundFromFront", toggle);
  }

  eventListener() {
    socket.on("invalidRoom", (roomId) => {
      alert(`Sorry, game room: ${roomId} not found`);
      this.setState({ buttonClickedName: "join" });
    });
    socket.on("gameAlreadyStarted", (roomId) => {
      alert(`Sorry, the game for code ${roomId} has already started...`);
      window.location.reload(false);
    });
    socket.on("playAgain", () => {
      this.setState({ gameOver: true });
    });
    socket.on("gameStarted", () => {
      this.setState({ waitingRoom: false });
    });
    socket.on("notEnoughPlayers", () => {
      alert(
        "Cannot start game with only one player. Please do not press 'START!' until you see another player's name."
      );
      this.setState({
        buttonClickedName: "create",
        gameStarted: false,
      });
    });
    socket.on("playerGone", () => {
      alert(
        "A player has left the room, please play again using a different game room code"
      );
      window.location.reload(false);
    });
  }

  copied() {
    this.setState({ alertCopied: true });
    setTimeout(() => this.setState({ alertCopied: false }), 1500);
  }

  render() {
    let state = this.state;
    return (
      <div id="main-wrapper">
        <main id="main">
          <nav>
            {state.sound ? (
              <button
                className="icono icono-volumeHigh"
                onClick={() => {
                  this.setState({ sound: false });
                  this.toggleSound("off");
                }}
              ></button>
            ) : (
              <button
                className="icono icono-volumeMute"
                onClick={() => {
                  this.setState({ sound: true });
                  this.toggleSound("on");
                }}
              ></button>
            )}
            <ScoreBoard
              players={state.players}
              gameOver={state.gameOver}
              socket={socket}
              startGame={this.startGame}
              code={this.state.code}
            />
            {state.buttonClickedName === "create" ? (
              <div id="game-start">
                <p>
                  Wait for all
                  <br />
                  players
                  <Dot>.</Dot>
                  <Dot>.</Dot>
                  <Dot>.</Dot>
                </p>
                <button
                  className="start-game-button"
                  type="submit"
                  onClick={this.startGame}
                >
                  START!
                </button>
                <p>Game Code:</p>
                <p className="gameCode" style={{ fontSize: "17" }}>
                  <CopyToClipboard text={this.state.code} onCopy={this.copied}>
                    <span>{this.state.code}</span>
                  </CopyToClipboard>
                </p>
                <p>{this.state.alertCopied ? <span>*COPIED*</span> : null}</p>
              </div>
            ) : null}
            {state.waitingRoom && state.buttonClickedName !== "create" ? (
              <p className="waiting-room">
                Waiting for <br /> game to start
                <Dot>.</Dot>
                <Dot>.</Dot>
                <Dot>.</Dot>
              </p>
            ) : null}
          </nav>
          <div>
            {!state.beginGameButtonClicked ? (
              <Popup defaultOpen closeOnDocumentClick={false}>
                <div id="container-start">
                  <div>
                    <img className="logo" src="/public/assets/DotEaterLogo.png" />
                  </div>
                  <div>
                      <button
                      className="begin-button"
                      onClick={() =>
                        this.setState({
                          beginGameButtonClicked: true,
                          buttonClicked: true,
                          waitingRoom: false,
                        })
                      }
                    >
                      CLICK TO BEGIN
                    </button>
                  </div>
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
                      placeholder={this.state.name ? this.state.name : this.state.placeholderName}
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
                      onClick={() => {
                        let code = randomString();
                        this.setState({
                          code,
                          buttonClicked: false,
                          buttonClickedName: "create",
                        });
                      }}
                    >
                      Create A Game
                    </button>

                    {/* Join Game */}
                    <button
                      type="button"
                      name="join"
                      disabled={!state.name}
                      onClick={() => {
                        this.setState({
                          buttonClicked: false,
                          buttonClickedName: "join",
                        });
                      }}
                    >
                      Join A Game
                    </button>
                  </div>
                  <div className="demo-button">
                    <button id="demo" disabled={!state.name} onClick={this.startDemo}>Play Demo</button>
                  </div>
                </div>
              </Popup>
            ) : null}
          </div>

          {/* Popup for game creator */}
          {this.state.buttonClickedName === "create" ? (
            <Popup open closeOnDocumentClick={false}>
              {(close) => (
                <div className="init-game-create">
                  <div id="creator-p-text">
                    <p>
                      You<br /> <br/>
                      **<br/>MUST ENTER<br/>**<br /> <br/>
                      Game Room<br/>
                      for your friends to join
                    </p>
                  </div>
                  <div className="creator-text" style={{ textAlign: "center" }}>

                    <div className="share-code">
                      <div>
                        <h3>Share this code with friends:</h3>
                      </div>
                      <div>
                        <h1>
                          <CopyToClipboard
                            text={this.state.code}
                            onCopy={this.copied}
                          >
                            <span className="gameCode">{state.code}</span>
                          </CopyToClipboard>
                        </h1>
                      </div>

                      {this.state.alertCopied ? <span>*COPIED*</span> : null}
                    </div>
                  </div>
                  <div className="big-enter">
                    <button
                      type="submit"
                      className="enter-game-button"
                      onClick={() => {
                        this.state.code;
                        this.createGame();
                        close();
                      }}
                    >
                      Enter Game Room
                    </button>
                    <button
                      className="back-button"
                      type="submit"
                      onClick={() => {
                        games.doc(state.code).delete();
                        this.setState({
                          buttonClicked: true,
                          buttonClickedName: "",
                          players: {},
                        });
                      }}
                      open={false}
                    >
                      GO BACK
                    </button>
                  </div>
                </div>
              )}
            </Popup>
          ) : null}

          {/* Popup for game joiners */}
          {this.state.buttonClickedName === "join" ? (
            <Popup open closeOnDocumentClick={false}>
              <div className="init-game">
                <div>
                  <h4>Game Code Please:</h4>
                </div>
                <div>
                  <form onSubmit={() => {
                    this.joinGame();
                    this.setState({ buttonClickedName: "", waitingRoom: true });
                  }}>
                    <input
                      type="text"
                      placeholder="Game Code Here"
                      maxLength="4"
                      onChange={() => this.handleCodeChange(event)}
                    />
                  </form>
                </div>
                <div className="join-enter">
                  <button
                      type="button"
                      className="join-goback-button"
                      onClick={() =>
                        this.setState({
                          buttonClicked: true,
                          buttonClickedName: "",
                        })
                      }
                      open={false}
                    >
                      Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={!this.state.code}
                    className="join-enter-button"
                    onClick={() => {
                      this.joinGame();
                      this.setState({ buttonClickedName: "", waitingRoom: true });
                    }}
                  >
                    ENTER GAME
                  </button>
                </div>
              </div>
            </Popup>
          ) : null}
        </main>
      </div>
    );
  }
}

export default App;
