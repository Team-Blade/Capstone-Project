import Level1 from "./Level1";
import Phaser from "phaser";
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scale: {
    scale: "SHOW_ALL",
    orientation: "LANDSCAPE"
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
