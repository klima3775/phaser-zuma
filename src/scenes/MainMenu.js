import { Scene } from "phaser";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(400, 300, "background");

    this.add.image(400, 150, "Zuma Prototype"),
      {
        fontFamily: "Arial Black",
        fontSize: "32px",
        color: "#ffffff",
      }.setOrigin(0.5);

    const restartButton = this.add
      .text(400, 400, "Restart", { fontSize: "24px", fill: "#0f0" })
      .setOrigin(0.5);

    restartButton.setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
