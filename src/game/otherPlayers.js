import SmallPac from "./SmallPac.js";

export default function addOtherPlayers(scene, player) {
  const x = scene[player.playerNumber].startPositions.x;
  const y = scene[player.playerNumber].startPositions.y;
  const playerNumber = player.playerNumber;

  const otherPlayer = new SmallPac({
    scene: scene,
    x: scene.map.tileToWorldX(x),
    y: scene.map.tileToWorldY(y),
    key: `${scene[playerNumber].color}sclosed`,
    playerNumber: playerNumber
  });

  otherPlayer.setScale(scene.collisionLayer.scale * 2.1);
  otherPlayer.tilePositionX = scene.map.worldToTileX(otherPlayer.x);
  otherPlayer.tilePositionY = scene.map.worldToTileY(otherPlayer.y);
  scene.physics.add.collider(otherPlayer, scene.collisionLayer);

  scene.physics.add.overlap(
    otherPlayer,
    scene.pac
  );

  scene.otherPlayersArray.push(otherPlayer);
  scene.playersAlive[playerNumber] = otherPlayer;
  otherPlayer.playerId = player.playerId;
  scene.otherPlayers.add(otherPlayer);
}
