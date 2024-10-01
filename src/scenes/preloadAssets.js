import Phaser from "phaser";

export default class PreloadAssets extends Phaser.Scene {
  // конструктор
  constructor() {
    super({
      key: "PreloadAssets",
    });
  }

  // метод, который будет вызван во время предзагрузки класса
  preload() {
    // загрузка изображения
    this.load.image("gem", "../../public/assets/gem.png");
  }

  // метод, который будет выполнен при создании сцены
  create() {
    // запуск сцены PlayGame
    this.scene.start("PlayGame");
  }
}
