import Phaser from "phaser";

export class PreloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: "PreloadAssets",
    });
  }

  preload() {
    this.load.image("gem", "../../public/assets/gem.png");
    this.load.image("bg", "../../public/assets/bg.webp");
    this.load.image("Hello", "../../public/assets/Hello.webp");
    this.load.audio("Zuma", "../../public/tracks/zuma_track.mp3");
  }

  create() {
    this.scene.start("Hello");
  }
}
