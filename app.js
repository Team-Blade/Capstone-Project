//collection: gameId = socket.io session id
const sidePanel = document.querySelector("#side-panel");
const form = document.querySelector("#add-player-form");

//rendering player
const renderSidePanel = doc => {
  let li = document.createElement("li");
  let name = document.createElement("span");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;

  li.appendChild(name);
  sidePanel.appendChild(li);
};

//get players
db.collection("players")
  .get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      renderSidePanel(doc);
    });
  });

//adding new player
form.addEventListener("submit", event => {
  event.preventDefault();

  db.collection("players").add({ name: form.name.value });
});
