// import React from "react";

// class Form extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       players: [],
//       name: ""
//     };
//     this.addPlayer = this.addPlayer.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//   }

//   addPlayer(event) {
//     event.preventDefault();

//     if (this.state.players.length < 4) {
//       let submittedName = event.target.value;
//       let players = {};
//       players[submittedName] = { score: 0 };
//       this.setState({ players: [...submittedName] });
//       props.newGame.set({ players }, { merge: true });
//     }
//   }

//   handleChange(event) {
//     this.setState({ currName: event.target.value });
//   }

//   render() {
//     return (
//       <div>
//         <h3>Ready to Play?</h3>
//         <form>
//           <input
//             onSubmit={this.addPlayer}
//             type="text"
//             name="name"
//             value={this.state.currName}
//             onChange={this.handleChange}
//             placeholder="packer-man"
//           />
//         </form>
//       </div>
//     );
//   }
// }

// export default Form;
