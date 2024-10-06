import Phaser from "phaser";

export class PreloadAssets extends Phaser.Scene {
  constructor() {
    super({
      key: "PreloadAssets",
    });
  }

  preload() {
    this.load.image("gem", "assets/gem.png");
    this.load.image("bg", "assets/bg.webp");
    this.load.image("Hello", "assets/Hello.webp");
    this.load.audio("Zuma", "tracks/zuma_track.mp3");
  }

  create() {
    this.scene.start("Hello");
  }
}
