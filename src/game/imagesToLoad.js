function loadImagesAndAudio(scene) {
  //loads yellow pacman

  scene.load.spritesheet("pacYellow", "/public/assets/royale.png", {
    frameWidth: 32,
    frameHeight: 28
  });

  scene.load.image("pinksquare", "/public/assets/pinksquare.jpeg");
  scene.load.image("blacksquare", "/public/assets/blacksquare.png");

  //instructions
  scene.load.image("eatPower", "/public/assets/instructions/Common062.png");
  scene.load.image("eatPacmen1", "/public/assets/instructions/Common063.png");
  scene.load.image("eatPacmen2", "/public/assets/instructions/Common064.png");
  scene.load.image("eatPacmen3", "/public/assets/instructions/Common065.png");
  scene.load.image("eatPacmen4", "/public/assets/instructions/Common066.png");
  scene.load.image("lastOneStanding", "/public/assets/instructions/Common068.png")
  scene.load.image("winner", "public/assets/instructions/GameMain070.png");

  //countdown numbers
  scene.load.image("1", "/public/assets/countdown/GameMain281.png");
  scene.load.image("2", "/public/assets/countdown/GameMain282.png");
  scene.load.image("3", "/public/assets/countdown/GameMain283.png");
  scene.load.image("fight", "/public/assets/countdown/GameMain306.png");

  //winner images
  scene.load.image("player1", "/public/assets/winner/GameMain290.png");
  scene.load.image("player2", "/public/assets/winner/GameMain293.png");
  scene.load.image("player3", "/public/assets/winner/GameMain292.png");
  scene.load.image("player4", "/public/assets/winner/GameMain291.png");

  //pacman yellow small pre-load images
  scene.load.image("ysclosed", "/public/assets/yellowSmall/GameMain020.png");
  scene.load.image("ysleft1", "/public/assets/yellowSmall/GameMain023.png");
  scene.load.image("ysleft2", "/public/assets/yellowSmall/GameMain024.png");
  scene.load.image("ysright1", "/public/assets/yellowSmall/GameMain025.png");
  scene.load.image("ysright2", "/public/assets/yellowSmall/GameMain026.png");
  scene.load.image("ysup1", "/public/assets/yellowSmall/GameMain027.png");
  scene.load.image("ysup2", "/public/assets/yellowSmall/GameMain028.png");
  scene.load.image("ysdown1", "/public/assets/yellowSmall/GameMain021.png");
  scene.load.image("ysdown2", "/public/assets/yellowSmall/GameMain022.png");
  scene.load.image("ysdeath1", "/public/assets/yellowSmall/GameMain114.png");
  scene.load.image("ysdeath2", "/public/assets/yellowSmall/GameMain115.png");
  scene.load.image("ysdeath3", "/public/assets/yellowSmall/GameMain116.png");
  scene.load.image("ysdeath4", "/public/assets/yellowSmall/GameMain117.png");
  scene.load.image("ysdeath5", "/public/assets/yellowSmall/GameMain118.png");
  scene.load.image("ysdeath6", "/public/assets/yellowSmall/GameMain119.png");
  scene.load.image("ysdeath7", "/public/assets/yellowSmall/GameMain120.png");
  scene.load.image("ysdeath8", "/public/assets/yellowSmall/GameMain121.png");
  scene.load.image("vysclosed", "/public/assets/yellowSmall/GameMain078.png");
  scene.load.image("vysdown1", "/public/assets/yellowSmall/GameMain079.png");
  scene.load.image("vysdown2", "/public/assets/yellowSmall/GameMain080.png");
  scene.load.image("vysleft1", "/public/assets/yellowSmall/GameMain081.png");
  scene.load.image("vysleft2", "/public/assets/yellowSmall/GameMain082.png");
  scene.load.image("vysright1", "/public/assets/yellowSmall/GameMain083.png");
  scene.load.image("vysright2", "/public/assets/yellowSmall/GameMain084.png");
  scene.load.image("vysup1", "/public/assets/yellowSmall/GameMain085.png");
  scene.load.image("vysup2", "/public/assets/yellowSmall/GameMain086.png");
  

  //pacman yellow big preload images
  scene.load.image("ybclosed", "/public/assets/yellowBig/GameMain230.png");
  scene.load.image("ybleft1", "/public/assets/yellowBig/GameMain233.png");
  scene.load.image("ybleft2", "/public/assets/yellowBig/GameMain234.png");
  scene.load.image("ybright1", "/public/assets/yellowBig/GameMain235.png");
  scene.load.image("ybright2", "/public/assets/yellowBig/GameMain236.png");
  scene.load.image("ybup1", "/public/assets/yellowBig/GameMain237.png");
  scene.load.image("ybup2", "/public/assets/yellowBig/GameMain238.png");
  scene.load.image("ybdown1", "/public/assets/yellowBig/GameMain231.png");
  scene.load.image("ybdown2", "/public/assets/yellowBig/GameMain232.png");

  //pacman blue small preload images
  scene.load.image("bsclosed", "/public/assets/blueSmall/GameMain038.png");
  scene.load.image("bsleft1", "/public/assets/blueSmall/GameMain041.png");
  scene.load.image("bsleft2", "/public/assets/blueSmall/GameMain042.png");
  scene.load.image("bsright1", "/public/assets/blueSmall/GameMain043.png");
  scene.load.image("bsright2", "/public/assets/blueSmall/GameMain044.png");
  scene.load.image("bsup1", "/public/assets/blueSmall/GameMain045.png");
  scene.load.image("bsup2", "/public/assets/blueSmall/GameMain046.png");
  scene.load.image("bsdown1", "/public/assets/blueSmall/GameMain039.png");
  scene.load.image("bsdown2", "/public/assets/blueSmall/GameMain040.png");
  scene.load.image("bsdeath1", "/public/assets/blueSmall/GameMain130.png");
  scene.load.image("bsdeath2", "/public/assets/blueSmall/GameMain131.png");
  scene.load.image("bsdeath3", "/public/assets/blueSmall/GameMain132.png");
  scene.load.image("bsdeath4", "/public/assets/blueSmall/GameMain133.png");
  scene.load.image("bsdeath5", "/public/assets/blueSmall/GameMain134.png");
  scene.load.image("bsdeath6", "/public/assets/blueSmall/GameMain135.png");
  scene.load.image("bsdeath7", "/public/assets/blueSmall/GameMain136.png");
  scene.load.image("bsdeath8", "/public/assets/blueSmall/GameMain137.png");
  scene.load.image("vbsclosed", "/public/assets/blueSmall/GameMain096.png");
  scene.load.image("vbsdown1", "/public/assets/blueSmall/GameMain097.png");
  scene.load.image("vbsdown2", "/public/assets/blueSmall/GameMain098.png");
  scene.load.image("vbsleft1", "/public/assets/blueSmall/GameMain099.png");
  scene.load.image("vbsleft2", "/public/assets/blueSmall/GameMain100.png");
  scene.load.image("vbsright1", "/public/assets/blueSmall/GameMain101.png");
  scene.load.image("vbsright2", "/public/assets/blueSmall/GameMain102.png");
  scene.load.image("vbsup1", "/public/assets/blueSmall/GameMain103.png");
  scene.load.image("vbsup2", "/public/assets/blueSmall/GameMain104.png");

  //pacman blue big preload images

  scene.load.image("bbclosed", "/public/assets/blueBig/GameMain248.png");
  scene.load.image("bbleft1", "/public/assets/blueBig/GameMain251.png");
  scene.load.image("bbleft2", "/public/assets/blueBig/GameMain252.png");
  scene.load.image("bbright1", "/public/assets/blueBig/GameMain253.png");
  scene.load.image("bbright2", "/public/assets/blueBig/GameMain254.png");
  scene.load.image("bbup1", "/public/assets/blueBig/GameMain255.png");
  scene.load.image("bbup2", "/public/assets/blueBig/GameMain256.png");
  scene.load.image("bbdown1", "/public/assets/blueBig/GameMain249.png");
  scene.load.image("bbdown2", "/public/assets/blueBig/GameMain250.png");

  //pacman pink small preload images
  scene.load.image("psclosed", "/public/assets/pinkSmall/GameMain029.png");
  scene.load.image("psleft1", "/public/assets/pinkSmall/GameMain032.png");
  scene.load.image("psleft2", "/public/assets/pinkSmall/GameMain033.png");
  scene.load.image("psright1", "/public/assets/pinkSmall/GameMain034.png");
  scene.load.image("psright2", "/public/assets/pinkSmall/GameMain035.png");
  scene.load.image("psup1", "/public/assets/pinkSmall/GameMain036.png");
  scene.load.image("psup2", "/public/assets/pinkSmall/GameMain037.png");
  scene.load.image("psdown1", "/public/assets/pinkSmall/GameMain030.png");
  scene.load.image("psdown2", "/public/assets/pinkSmall/GameMain031.png");
  scene.load.image("psdeath1", "/public/assets/pinkSmall/GameMain122.png");
  scene.load.image("psdeath2", "/public/assets/pinkSmall/GameMain123.png");
  scene.load.image("psdeath3", "/public/assets/pinkSmall/GameMain124.png");
  scene.load.image("psdeath4", "/public/assets/pinkSmall/GameMain125.png");
  scene.load.image("psdeath5", "/public/assets/pinkSmall/GameMain126.png");
  scene.load.image("psdeath6", "/public/assets/pinkSmall/GameMain127.png");
  scene.load.image("psdeath7", "/public/assets/pinkSmall/GameMain128.png");
  scene.load.image("psdeath8", "/public/assets/pinkSmall/GameMain129.png");
  scene.load.image("vpsclosed", "/public/assets/pinkSmall/GameMain087.png");
  scene.load.image("vpsdown1", "/public/assets/pinkSmall/GameMain088.png");
  scene.load.image("vpsdown2", "/public/assets/pinkSmall/GameMain089.png");
  scene.load.image("vpsleft1", "/public/assets/pinkSmall/GameMain090.png");
  scene.load.image("vpsleft2", "/public/assets/pinkSmall/GameMain091.png");
  scene.load.image("vpsright1", "/public/assets/pinkSmall/GameMain092.png");
  scene.load.image("vpsright2", "/public/assets/pinkSmall/GameMain093.png");
  scene.load.image("vpsup1", "/public/assets/pinkSmall/GameMain094.png");
  scene.load.image("vpsup2", "/public/assets/pinkSmall/GameMain095.png");


  //pacman pink big preload images
  scene.load.image("pbclosed", "/public/assets/pinkBig/GameMain239.png");
  scene.load.image("pbleft1", "/public/assets/pinkBig/GameMain242.png");
  scene.load.image("pbleft2", "/public/assets/pinkBig/GameMain243.png");
  scene.load.image("pbright1", "/public/assets/pinkBig/GameMain244.png");
  scene.load.image("pbright2", "/public/assets/pinkBig/GameMain245.png");
  scene.load.image("pbup1", "/public/assets/pinkBig/GameMain246.png");
  scene.load.image("pbup2", "/public/assets/pinkBig/GameMain247.png");
  scene.load.image("pbdown1", "/public/assets/pinkBig/GameMain240.png");
  scene.load.image("pbdown2", "/public/assets/pinkBig/GameMain241.png");

  //pacman red small preload images
  scene.load.image("rsclosed", "/public/assets/redSmall/GameMain047.png");
  scene.load.image("rsleft1", "/public/assets/redSmall/GameMain050.png");
  scene.load.image("rsleft2", "/public/assets/redSmall/GameMain051.png");
  scene.load.image("rsright1", "/public/assets/redSmall/GameMain052.png");
  scene.load.image("rsright2", "/public/assets/redSmall/GameMain053.png");
  scene.load.image("rsup1", "/public/assets/redSmall/GameMain054.png");
  scene.load.image("rsup2", "/public/assets/redSmall/GameMain055.png");
  scene.load.image("rsdown1", "/public/assets/redSmall/GameMain048.png");
  scene.load.image("rsdown2", "/public/assets/redSmall/GameMain049.png");
  scene.load.image("rsdeath1", "/public/assets/redSmall/GameMain138.png");
  scene.load.image("rsdeath2", "/public/assets/redSmall/GameMain139.png");
  scene.load.image("rsdeath3", "/public/assets/redSmall/GameMain140.png");
  scene.load.image("rsdeath4", "/public/assets/redSmall/GameMain141.png");
  scene.load.image("rsdeath5", "/public/assets/redSmall/GameMain142.png");
  scene.load.image("rsdeath6", "/public/assets/redSmall/GameMain143.png");
  scene.load.image("rsdeath7", "/public/assets/redSmall/GameMain144.png");
  scene.load.image("rsdeath8", "/public/assets/redSmall/GameMain145.png");
  scene.load.image("vrsclosed", "/public/assets/redSmall/GameMain105.png");
  scene.load.image("vrsdown1", "/public/assets/redSmall/GameMain106.png");
  scene.load.image("vrsdown2", "/public/assets/redSmall/GameMain107.png");
  scene.load.image("vrsleft1", "/public/assets/redSmall/GameMain108.png");
  scene.load.image("vrsleft2", "/public/assets/redSmall/GameMain109.png");
  scene.load.image("vrsright1", "/public/assets/redSmall/GameMain110.png");
  scene.load.image("vrsright2", "/public/assets/redSmall/GameMain111.png");
  scene.load.image("vrsup1", "/public/assets/redSmall/GameMain112.png");
  scene.load.image("vrsup2", "/public/assets/redSmall/GameMain113.png");

  //pacman red big preload images
  scene.load.image("rbclosed", "/public/assets/redBig/GameMain257.png");
  scene.load.image("rbleft1", "/public/assets/redBig/GameMain260.png");
  scene.load.image("rbleft2", "/public/assets/redBig/GameMain261.png");
  scene.load.image("rbright1", "/public/assets/redBig/GameMain262.png");
  scene.load.image("rbright2", "/public/assets/redBig/GameMain263.png");
  scene.load.image("rbup1", "/public/assets/redBig/GameMain264.png");
  scene.load.image("rbup2", "/public/assets/redBig/GameMain265.png");
  scene.load.image("rbdown1", "/public/assets/redBig/GameMain258.png");
  scene.load.image("rbdown2", "/public/assets/redBig/GameMain259.png");

  //orange ghost preload images
  scene.load.image("og1", "/public/assets/ghosts/GameMain178.png"); //down
  scene.load.image("og2", "/public/assets/ghosts/GameMain179.png"); //down
  scene.load.image("og3", "/public/assets/ghosts/GameMain180.png"); //left
  scene.load.image("og4", "/public/assets/ghosts/GameMain181.png"); //left
  scene.load.image("og5", "/public/assets/ghosts/GameMain182.png"); //right
  scene.load.image("og6", "/public/assets/ghosts/GameMain183.png"); //right
  scene.load.image("og7", "/public/assets/ghosts/GameMain184.png"); //up
  scene.load.image("og8", "/public/assets/ghosts/GameMain185.png"); //up
  scene.load.image("og9", "/public/assets/ghosts/GameMain186.png"); //back

  //purple ghost preload images
  scene.load.image("pg1", "/public/assets/ghosts/GameMain187.png"); //down
  scene.load.image("pg2", "/public/assets/ghosts/GameMain188.png"); //down
  scene.load.image("pg3", "/public/assets/ghosts/GameMain189.png"); //left
  scene.load.image("pg4", "/public/assets/ghosts/GameMain190.png"); //left
  scene.load.image("pg5", "/public/assets/ghosts/GameMain191.png"); //right
  scene.load.image("pg6", "/public/assets/ghosts/GameMain192.png"); //right
  scene.load.image("pg7", "/public/assets/ghosts/GameMain193.png"); //up
  scene.load.image("pg8", "/public/assets/ghosts/GameMain194.png"); //up
  scene.load.image("pg9", "/public/assets/ghosts/GameMain195.png"); //back

  //dots and food preload images

  scene.load.image("smallDot", "/public/assets/extract/GameMain219Edit2.png");
  scene.load.image("largeDot", "/public/assets/extract/Common061.png");
  scene.load.image("candy", "/public/assets/food/GameMain004.png");
  scene.load.image("burger", "/public/assets/food/GameMain006.png");
  scene.load.image("papaya", "/public/assets/food/GameMain008.png");
  scene.load.image("peach", "/public/assets/food/GameMain010.png");
  scene.load.image("pizzaSlice", "/public/assets/food/GameMain011.png");
  scene.load.image("cakeSlice", "/public/assets/food/GameMain003.png");
  scene.load.image("egg", "/public/assets/food/GameMain014.png");
  scene.load.image("banana", "/public/assets/food/GameMain001.png");

  //load ghost flashing images
  scene.load.image("ghostFlash1", "/public/assets/ghosts/GameMain214.png"); //blue 1
  scene.load.image("ghostFlash2", "/public/assets/ghosts/GameMain215.png"); //blue 2
  scene.load.image("ghostFlash3", "/public/assets/ghosts/GameMain216.png"); //white 1
  scene.load.image("ghostFlash4", "/public/assets/ghosts/GameMain217.png"); //white 2
  scene.load.image("ghostFlash5", "/public/assets/ghosts/GameMain218.png"); //back
  scene.load.image("ghostEyesDown", "/public/assets/ghosts/GameMain266.png");
  scene.load.image("ghostEyesLeft", "/public/assets/ghosts/GameMain267.png");
  scene.load.image("ghostEyesRight", "/public/assets/ghosts/GameMain268.png");
  scene.load.image("ghostEyesUp", "/public/assets/ghosts/GameMain269.png");

  scene.load.audio("game_start", "/public/assets/audio/game_start.mp3");
  scene.load.audio("death", "/public/assets/audio/death.mp3");
  scene.load.audio("eat_ghost", "/public/assets/audio/eat_ghost.mp3");
  scene.load.audio("eat", "/public/assets/audio/pause.mp3");
  scene.load.audio("intro", "/public/assets/audio/pause_beat.mp3");
  scene.load.audio("fruit", "/public/assets/audio/fruit.mp3");
  scene.load.audio("powerPellet", "/public/assets/audio/waza.mp3");
}

export default loadImagesAndAudio;
