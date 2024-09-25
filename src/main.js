import Phaser from "phaser";
import Preloader from "./scenes/Preloader";
import PlayGame from "./scenes/playGame";
import gameOptions from "./gameOptions";

// объект для инициализации Scale Manager
const scaleObject = {
  mode: Phaser.Scale.FIT, // подгонка размера для автоматического размещения в окне
  autoCenter: Phaser.Scale.CENTER_BOTH, // центрирование игры по горизонтали и вертикали
  parent: "game-container", // DOM id, где будет отображаться игра
  width: gameOptions.gameSize.width, // ширина игры в пикселях
  height: gameOptions.gameSize.height, // высота игры в пикселях
};

// объект конфигурации игры
const configObject = {
  type: Phaser.AUTO, // рендерер игры
  backgroundColor: gameOptions.gameBackgroundColor, // цвет фона игры
  scale: scaleObject, // настройки масштаба
  scene: [
    // массив с игровыми сценами
    Preloader, // сцена PreloadAssets
    PlayGame, // сцена PlayGame
  ],
};

new Phaser.Game(configObject);
