export class GameOver extends Phaser.Scene {
  constructor() {
    super({
      key: "GameOver",
    });
  }

  create() {
    // Установка черного фона
    this.cameras.main.setBackgroundColor("#000000");

    // Добавление текста "Game Over" в центр экрана
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, "Game Over", {
        fontSize: "64px",
        color: "#00ff00", // Зеленый цвет текста
      })
      .setOrigin(0.5, 0.5);

    // Добавление кнопки "Restart" внизу экрана
    const restartButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.height - 50,
        "Restart",
        {
          fontSize: "32px",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true }) // Курсор в виде руки при наведении
      .on("pointerdown", () => this.scene.start("PlayGame")); // Перезапуск сцены PlayGame при нажатии
  }
}
