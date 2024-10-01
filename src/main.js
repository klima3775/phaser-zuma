// импортируем модули

import PreloadAssets from "./scenes/preloadAssets";
import PlayGame from "./scenes/playGame";
import GameOptions from "./gameOptions";
// объект для инициализации Scale Manager
const scaleObject = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: "thegame",
  width: GameOptions.gameSize.width,
  height: GameOptions.gameSize.height,
};

// объект конфигурации игры
const configObject = {
  type: Phaser.AUTO,
  backgroundColor: GameOptions.gameBackgroundColor,
  scale: scaleObject,
  scene: [PreloadAssets, PlayGame],
};

// сама игра
new Phaser.Game(configObject);
