import Level1 from "./Level1.js";
const config = {
  type: Phaser.AUTO,
  parent: "divId",
  scale: {
    scale: "SHOW_ALL",
    orientation: "LANDSCAPE",
    width: 1860 * 0.7,
    height: 900 * 0.7
  },
  resolution: window.devicePixelRatio,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  dom: {
    createContainer: true
  },
  scene: [Level1]
};
const game = new Phaser.Game(config);

export default game;
