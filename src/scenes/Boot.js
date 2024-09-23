import Phaser from "phaser";

export default class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("ball", "assets/1.png");
    this.load.image("ball", "assets/2.png");
    this.load.image("ball", "assets/3.png");
    this.load.image("ball", "assets/4.png");
    this.load.image("shooter", "assets/shooter.png");
    this.load.image("background", "assets/bg.png");
  }

  create() {
    this.scene.start("Game");
  }
}
