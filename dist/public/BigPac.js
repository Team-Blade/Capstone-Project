import SmallPac from "./SmallPac";
export default class BigPac extends SmallPac {
  constructor(config) {
    super({ config.scene, config.x, config.y, config.key });
    
  }
}
