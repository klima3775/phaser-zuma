export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    // Загрузка изображений для шаров и пушки
    this.load.image("gem", "./assets/gem.png");
  }

  create() {
    // Переход на основную игровую сцену после загрузки ресурсов
    this.scene.start("playGame");
  }
}
