import Phaser from "phaser";

export class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOver",
    });
  }

  create() {
    // Добавление текста "Game Over" в центр экрана
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Game Over", {
        fontSize: "64px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);
  }
}
