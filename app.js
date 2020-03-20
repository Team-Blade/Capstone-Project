//collection: gameId = socket.io session id
const sidePanel = document.querySelector("#side-panel");
const form = document.querySelector("#add-player-form");
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

// const code = randomString(); //game code to share with friends
const code = "zsiMs";
const newGame = games.doc(code);

//rendering player
const renderSidePanel = doc => {
  if (doc.id == code) {
    console.log(code);
    let li = document.createElement("li");
    let players = Object.keys(doc.data().players);
    li.setAttribute("game-id", doc.id);
    li.textContent = players;
    sidePanel.appendChild(li);
  }
};

//adding new player to document

form.addEventListener("submit", event => {
  event.preventDefault();
  let name = form.name.value;
  let players = {};
  players[name] = { score: 0 };
  newGame.set({ players }, { merge: true });

  form.name.value = "";
});

//real-time listner -> when database is changed, it will automatically render the update
games.onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type == "added") {
      renderSidePanel(change.doc);
    } else if (change.type == "modified") {
      renderSidePanel(change.doc);
    }
    //can also use this for real-time deleting data
  });
});
