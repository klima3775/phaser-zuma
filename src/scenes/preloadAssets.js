export class PreloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: "PreloadAssets",
    });
  }

  preload() {
    this.load.image("gem", "../../public/assets/gem.png");
  }

  create() {
    this.scene.start("PlayGame");
  }
}
