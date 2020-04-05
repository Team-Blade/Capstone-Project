export function setUpMapLayer(scene) {
  const map = scene.map;

  const pinkTileset = map.addTilesetImage("pinksquare", "pinksquare");
  const blackTileset = map.addTilesetImage("blacksquare", "blacksquare");

  // creates the map layer, key must match layer name in tiled
  scene.collisionLayer = map.createStaticLayer(
    "mapBaseLayer",
    [pinkTileset, blackTileset],
    0,
    0
  );

  scene.collisionLayer.setCollisionByProperty({
    collision: true
  });

  scene.collisionLayer.setScale(0.7);

}

export function setUpFoodLayers(scene) {
  const map = scene.map;

  const smallDotTileset = map.addTilesetImage("GameMain219Edit2", "smallDot");
  const largeDotTileset = map.addTilesetImage("Common061", "largeDot");
  const candyTileset = map.addTilesetImage("GameMain004", "candy");
  //const burgerTileset = map.addTilesetImage("GameMain006", "burger");
  //const papayaTileset = map.addTilesetImage("GameMain008", "papaya");
  //const peachTileset = map.addTilesetImage("GameMain010", "peach");
  //const pizzaSliceTileset = map.addTilesetImage("GameMain011", "pizzaSlice");
  const cakeSliceTileset = map.addTilesetImage("GameMain003", "cakeSlice");
  //const eggTileset = map.addTilesetImage("GameMain014", "egg");
  const bananaTileset = map.addTilesetImage("GameMain001", "banana");

  //creates the food and dots layer
  scene.collisionLayerFoodDots = map.createDynamicLayer(
    "foodDotsLayer1",
    [],
    0,
    0
  );

  scene.collisionLayerFoodDots.active = false;
  scene.collisionLayerFoodDots.setScale(scene.collisionLayer.scale);

  //small dots
  scene.dots = scene.physics.add.staticGroup();
  //big dots
  scene.bigDots = scene.physics.add.staticGroup();
  //food
  scene.food = scene.physics.add.staticGroup();

  //small dots

  scene.collisionLayerFoodDots.forEachTile(tile => {
    if (tile.index === 9) {
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
    if (tile.index === 5) {
      const x = tile.getCenterX();
      const y = tile.getCenterY();
      const dot = scene.bigDots.create(x, y, "largeDot");
    }
  });

  // candy

  scene.collisionLayerFoodDots.forEachTile(tile => {
    if (tile.index === 6) {
      const x = tile.getCenterX();
      const y = tile.getCenterY();
      const foodItem = scene.food.create(x, y, "candy");
    }
  });


  //cake Slice

  scene.collisionLayerFoodDots.forEachTile(tile => {
    if (tile.index === 7) {
      const x = tile.getCenterX();
      const y = tile.getCenterY();
      const foodItem = scene.food.create(x, y, "cakeSlice");
    }
  });


  //banana

  scene.collisionLayerFoodDots.forEachTile(tile => {
    if (tile.index === 8) {
      const x = tile.getCenterX();
      const y = tile.getCenterY();
      const foodItem = scene.food.create(x, y, "banana");
    }
  });


  scene.food.getChildren().forEach(foodItem => {
    foodItem.setSize(40, 40);
  });
}
