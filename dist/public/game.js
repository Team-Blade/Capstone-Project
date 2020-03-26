import Level1 from "./Level1.js";
const config = {
  type: Phaser.AUTO,
  scale: {
    scale: "SHOW_ALL",
    orientation: "LANDSCAPE",
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: "100%",
    height: "100%"
  },
  resolution: window.deviePixelRatio,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scene: [Level1]
};
const game = new Phaser.Game(config);

export default game;
