export function displayInstructions(scene) {
    //ADD INSTRUCTIONS
    scene.eatPower = scene.add.image(160, 185, 'eatPower').setScale(0.27);
    scene.instructions = scene.add.sprite(160, 265, 'eatPacmen').setScale(0.27);
    scene.anims.create({
      key: 'instructions',
      frameRate: 1,
      frames: [{key: 'eatPacmen1'}, {key: 'eatPacmen2'}, {key: 'eatPacmen3'}, {key: 'eatPacmen4'}],
      repeat: 100
    })
    scene.instructions.anims.play("instructions", true);
    scene.lastOne = scene.add.image(160, 350, 'lastOneStanding').setScale(0.27);
    scene.winnerPic = scene.add.image(160, 435, 'winner').setScale(0.7);
}

export function destroyInstructions(scene) {
    scene.eatPower.destroy();
    scene.instructions.destroy();
    scene.lastOne.destroy();
    scene.winnerPic.destroy();
}