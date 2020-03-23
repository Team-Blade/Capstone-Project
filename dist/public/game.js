import Level1 from "./Level1.js";
const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  scale: {
    scale: "SHOW_ALL",
    orientation: "LANDSCAPE",
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
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
