import Phaser from "phaser";

export class Hello extends Phaser.Scene {
  constructor() {
    super({
      key: "Hello",
    });
  }

  preload() {
    // Загрузка фонового изображения
    this.load.image("Hello", "path/to/your/background/image.png");
  }

  create() {
    this.add
      .image(0, 0, "Hello")
      .setOrigin(0, 0)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // Добавление кнопки "Start" выше на экране
    const startButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 25, // Поднятие кнопки выше
        "Start",
        {
          fontSize: "64px",
          color: "#000000",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true }) // Курсор в виде руки при наведении
      .on("pointerdown", () => {
        this.scene.start("PlayGame");
      });
  }
}

export default Hello;
