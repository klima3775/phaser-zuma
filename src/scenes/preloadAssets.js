export class PreloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: "PreloadAssets",
    });
  }

  preload() {
    this.load.image("gem", "../../public/assets/gem.png");
    this.load.image("bg", "../../public/assets/bg.webp");
  }

  create() {
    this.scene.start("PlayGame");
  }
}
