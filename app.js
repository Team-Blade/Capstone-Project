//collection: gameId = socket.io session id
const sidePanel = document.querySelector("#side-panel");
const form = document.querySelector("#add-player-form");

//rendering player
const renderSidePanel = doc => {
  let li = document.createElement("li");
  let player = document.createElement("span");

  li.setAttribute("data-id", doc.id);
  player.textContent = doc
    .data()
    .players.forEach(player => console.log(player));

  li.appendChild(player);
  sidePanel.appendChild(li);
};
const game = db.collection("game");
//get players
game.get().then(snapshot => {
  snapshot.docs.forEach(doc => {
    renderSidePanel(doc);
  });
});

//adding new player
form.addEventListener("submit", event => {
  event.preventDefault();
    let name = form.name.value
  db.collection("game").add({ players: {form.name.value: } });
});

const randomString = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const string_length = 5;
  let randomstring = "";
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};

const randomCode = randomString();

//creates new document and adds fields
//should use randomly generated 4-digit code as documentID
const newGame = game.doc(code);

newGame.set({
  players: { sam: { score: 0 } }
});

newGame.set({
  players: { maggie: { score: 0 } }
});

//once code is generated and player 1 is added to the incremental
