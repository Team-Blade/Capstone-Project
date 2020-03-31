function setUpLayers (scene) {

    const map = scene.map;

    const pinkTileset = map.addTilesetImage("pinksquare", "pinksquare");
    const blackTileset = map.addTilesetImage("blacksquare", "blacksquare");
    const smallDotTileset = map.addTilesetImage("GameMain219", "smallDot");
    const largeDotTileset = map.addTilesetImage("Common061", "largeDot");
    const candyTileset = map.addTilesetImage("GameMain004", "candy");
    const burgerTileset = map.addTilesetImage("GameMain006", "burger");
    const papayaTileset = map.addTilesetImage("GameMain008", "papaya");
    const peachTileset = map.addTilesetImage("GameMain010", "peach");
    const pizzaSliceTileset = map.addTilesetImage("GameMain011", "pizzaSlice");
    const cakeSliceTileset = map.addTilesetImage("GameMain003", "cakeSlice");
    const eggTileset = map.addTilesetImage("GameMain014", "egg");

    // creates the map layer, key must match layer name in tiled
    scene.collisionLayer = map.createStaticLayer(
      "mapBaseLayer",
      [pinkTileset, blackTileset],
      0,
      0
    );

    scene.collisionLayer.setCollisionByProperty({ collision: true });

    scene.collisionLayer.setScale(0.7);

    //creates the food and dots layer
    scene.collisionLayerFoodDots = map.createDynamicLayer(
      "foodDotsLayer",
      [],
      0,
      0
    );
    //scene.collisionLayerFoodDots.setCollisionByProperty({ collision: true });

    scene.collisionLayerFoodDots.active = false;
    scene.collisionLayerFoodDots.setScale(scene.collisionLayer.scale);

    //small dots
    scene.dots = scene.physics.add.staticGroup();
    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 13) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "smallDot");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(30, 30);
    });

    //large dots
    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 4) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "largeDot");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(35, 35);
    });

    // candy

    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 6) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "candy");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });

    // burger

    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 5) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "burger");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });

    // papaya

    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 12) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "papaya");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });

    //peach
    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 11) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "peach");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });

    //pizza slice

    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 10) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "pizzaSlice");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });

    //cake Slice

    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 7) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "cakeSlice");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });

    //egg

    scene.collisionLayerFoodDots.forEachTile(tile => {
      if (tile.index === 9) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const dot = scene.dots.create(x, y, "egg");
      }
    });

    scene.dots.getChildren().forEach(dot => {
      dot.setSize(45, 45);
    });


}

export default setUpLayers;