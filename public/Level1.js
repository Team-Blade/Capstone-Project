export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
  }
  preload() {
    this.load.image("test", "/public/assets/extract/MapB4_Alpha.png");
    this.load.image("pacman-tiles", "/public/assets/pacman-tiles.png");
    this.load.tilemapTiledJSON(
      "map",
      "/public/assets/testpacmapcollisions2.json"
    );
  }
  create() {
    this.test = this.add.image(70, 70, "test");
    let map;
    let layer;
    map = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16
    });

    const tileset = map.addTilesetImage("pacman-tiles", "pacman-tiles");
    layer = map.createStaticLayer("Pacman", tileset, 0, 0);
  }
  update() {}
}
