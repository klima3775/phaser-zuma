import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  //   init() {}

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
    this.load.image("background", "bg.png");
    this.load.image("ball", "blueball.png");
    this.load.image("ball", "greenball.png");
    this.load.image("ball", "pinkball.png");
    this.load.image("ball", "redball.png");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
