const express = require("express");
const app = express();
const server = require("http").Server(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Eating dots on port ${PORT}`);
});
