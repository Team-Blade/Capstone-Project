import React from "react";
import Form from "./Form";
import SideBar from "./SideBar";
import Game from "./Game";
import db from "../src/firebase";

// import Footer from "./components/Footer";
import "../dist/public/style.css";

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
      players: [],
      name: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const name = this.state.name;
    const games = db.collection("games");
    // const code = randomString();
    const code = "12345";

    const newGame = games.doc(code);
    let players = {};
    players[name] = { score: 0 };
    newGame.set({ players }, { merge: true });

    if (!this.state.players.includes(name)) {
      this.setState({
        players: [...this.state.players, name],
        name: ""
      });
    } else {
      alert(`${name} already exists. Please use another gamer name`);
    }
  };

  render() {
    return (
      <div id="main-wrapper">
        <main id="main">
          <h1>Pac Man Battle Royal</h1>
          {/* <div id="form">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="pac-er-man"
                onChange={this.handleChange}
                value={this.state.name}
              />
              <button type="submit">
                generate <br /> code
              </button>
            </form>
          </div> */}
          <Form />
          <div id="sidebard">
            <ul>
              players:
              {this.state.players.map(player => {
                return <li key={player}>{player}</li>;
              })}
            </ul>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
