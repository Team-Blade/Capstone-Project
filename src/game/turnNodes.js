export class PathGraph {
  constructor(){
    this.matrix = [];
    this.adjacencyGraph = {};
  }

  constructMatrix(scene) {
    const numberOfTilesAcross = 15;
    const numberOfTilesInAColumn = 31;
    for (let yCounter = 0; yCounter < numberOfTilesAcross; yCounter++) {
      const newRow = [];
      for (let xCounter = 0; xCounter < numberOfTilesInAColumn; xCounter++) {
        const tile = scene.map.getTileAt(
          xCounter,
          yCounter,
          false,
          "mapBaseLayer"
        );
        newRow.push(tile);
      }
      this.matrix.push(newRow)
    }
  }

  constructAdjacencyGraph() {
    const matrix = this.matrix;
    for (let yCounter = 0; yCounter < matrix.length; yCounter++) {
      for (let xCounter = 0; xCounter < matrix[0].length; xCounter++) {
        const currentTile = matrix[yCounter][xCounter]
        if (currentTile.collides == true) {
          continue;
        }
        const neighborsList = {};
        this.adjacencyGraph[this.buildKey(yCounter, xCounter)] = {x: xCounter, y: yCounter};
        
        // check neighbor to the right
        let neighborX = xCounter + 1;
        let neighborY = yCounter;
        neighborsList = this.populateNeighborsList(neighborX, neighborY, 'right', neighborsList);
  
        // check neighbor to the left
        neighborX = xCounter - 1;
        neighborY = yCounter;
        neighborsList = this.populateNeighborsList(neighborX, neighborY, 'left', neighborsList);
  
        // check neighbor down
        neighborX = xCounter;
        neighborY = yCounter + 1;
        neighborsList = this.populateNeighborsList(neighborX, neighborY, 'down', neighborsList);
  
        // check neighbor up
        neighborX = xCounter;
        neighborY = yCounter - 1;
        neighborsList = this.populateNeighborsList(neighborX, neighborY, 'up', neighborsList);

        if (Object.keys(neighborsList).length > 2) {
          this.adjacencyGraph[this.buildKey(yCounter, xCounter)].isTurnNode = true;
        }
        this.adjacencyGraph[this.buildKey(yCounter, xCounter)].neighborsList = neighborsList;
      }
    }
  }

  addWrapToGraph() {
    const TILES_THAT_WRAP_UP = [[12, 0], [18, 0]];
    const TILES_THAT_WRAP_DOWN = [[12, 14], [18, 14]];

    TILES_THAT_WRAP_UP.forEach((wrappingTileCords) => {
      const wrappingTileCordY = wrappingTileCords[1];
      const wrappingTileCordX = wrappingTileCords[0];
      this.adjacencyGraph[this.buildKey(wrappingTileCordY, wrappingTileCordX)].neighborsList["up"] =
        this.buildNeighborObject(14, wrappingTileCordX, 'up', this.matrix[14][wrappingTileCordX])
    });

    TILES_THAT_WRAP_DOWN.forEach((wrappingTileCords) => {
      const wrappingTileCordY = wrappingTileCords[1];
      const wrappingTileCordX = wrappingTileCords[0];
      this.adjacencyGraph[this.buildKey(wrappingTileCordY, wrappingTileCordX)].neighborsList["down"] =
        this.buildNeighborObject(0, wrappingTileCordX, 'down', this.matrix[0][wrappingTileCordX])
    });
  }

  populateNeighborsList(candidateXIndex, candidateYIndex, direction, neighborsList) {
    const candidateRow = this.matrix[candidateYIndex];
    if (candidateRow) {
      const candidateTile = candidateRow[candidateXIndex];
      if (candidateTile && candidateTile.collides === false) {
        // neighborsList.push(this.buildNeighborObject(candidateYIndex, candidateXIndex, direction, candidateTile));
        neighborsList[direction] = this.buildNeighborObject(candidateYIndex, candidateXIndex, direction, candidateTile);
      }
    }
    return neighborsList;
  }

  buildNeighborObject(y, x, direction, tile) {
    return {
      x: x,
      y: y,
      tile: tile
    }
  }

  buildKey(y, x) {
    return String(y) + ':' + String(x);
  }

}

// class TurnNode {
//   constructor(x, y){
//     this.x = x;
//     this.y = y;
//   }
// }

//   const NumberOfTilesAcross = 15;
//   const NumberOfTilesInAColumn = 31;
//   const matrix = []
//   for (let yCounter = 0; yCounter < NumberOfTilesAcross; yCounter++) {
//     const newRow = [];
//     for (let xCounter = 0; xCounter < NumberOfTilesInAColumn; xCounter++) {
//       newRow.append(this.scene.map.getTileAt(
//         this.scene.map.tileToWorldX(xCounter),
//         this.scene.map.tileToWorldY(yCounter),
//         false,
//         "mapBaseLayer"
//       ));
//     }
//     matrix.append(newRow)
//   }


//   function populateNeighborsList(candidateXIndex, candidateYIndex, direction, neighborsList) {
//     const candidateRow = matrix[candidateYIndex];
//     if (candidateRow) {
//       const candidateTile = candidateRow[candidateXIndex];
//       if (candidateTile && candidateTile.collides === false) {
//         neighborsList.append(buildNeighborObject(candidateYIndex, candidateXIndex, direction, candidateTile));
//       }
//     }
//     return neighborsList;
//   }

//   function buildKey(y, x) {
//     return String(y) + ':' + String(x);
//   }

//   function buildNeighborObject(y, x, direction, tile) {
//     return {
//       key: buildKey(y, x),
//       direction: direction,
//       tile: tile
//     }
//   }

//   // build graph
//   /*
//   {
//     'yCounter1:xCounter1': [
//       {
//         key: 'yCounter1:Xouncter2',
//         direction: direction
//         tile: currentTile
//       },
//     ]
//   }
//   */
//   export const adjacencyGraph = {};
//   for (let yCounter = 0; yCounter < matrix.length; yCounter++) {
//     for (let xCounter = 0; xCounter < matrix[0].length; xCounter++) {
//       const currentTile = matrix[yCounter][xCounter]
//       if (currentTile.collides == true) {
//         continue;
//       }
//       const neighborsList = [];
//       // check neighbor to the right
//       let neighborX = xCounter + 1;
//       let neighborY = yCounter;
//       neighborsList.push(populateNeighborsList(neighborX, neighborY, 'right', neighborsList));

//       // check neighbor to the left
//       neighborX = xCounter -1;
//       neighborY = yCounter;
//       neighborsList.push(populateNeighborsList(neighborX, neighborY, 'left', neighborsList));

//       // check neighbor down
//       neighborX = xCounter;
//       neighborY = yCounter - 1;
//       neighborsList.push(populateNeighborsList(neighborX, neighborY, 'down', neighborsList));

//       // check neighbor up
//       neighborX = xCounter;
//       neighborY = yCounter + 1;
//       neighborsList.push(populateNeighborsList(neighborX, neighborY, 'up', neighborsList));

//       adjacencyGraph[key] = neighborsList;
//     }
//   }

//   // stored x, y
//   const TILES_THAT_WRAP_UP = [[0, 12], [0, 19]];
//   const TILES_THAT_WRAP_DOWN = [[14, 12], [14, 19]];

//   TILES_THAT_WRAP_UP.forEach((wrappingTileCords) => {
//     wrappingTileCordY = wrappingTileCords[1];
//     wrappingTileCordX = wrappingTileCords[0];
//     adjacencyGraph[buildKey(wrappingTileCordY, wrappingTileCordX)].append(
//       buildNeighborObject(14, wrappingTileCordX, 'up', matrix[14][wrappingTileCordX])
//     );
//   });

//   TILES_THAT_WRAP_DOWN.forEach((wrappingTileCords) => {
//     wrappingTileCordY = wrappingTileCords[1];
//     wrappingTileCordX = wrappingTileCords[0];
//     adjacencyGraph[buildKey(wrappingTileCordY, wrappingTileCordX)].append(
//       buildNeighborObject(0, wrappingTileCordX, 'down', matrix[0][wrappingTileCordX])
//     );
//   });