import Level1 from "./Level1.js";
const config = {
  type: Phaser.AUTO,
  scale: {
    scale: "SHOW_ALL",
    orientation: "LANDSCAPE",
    width: 1860 * 0.7,
    height: 900 * 0.7
  },
  resolution: window.deviePixelRatio,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  dom: {
    createContainer: true
  },
  scene: [Level1]
};
const game = new Phaser.Game(config);

export default game;
