import Phaser from "phaser";
import { PreloadAssets } from "./scenes/preloadAssets";
import { PlayGame } from "./scenes/playGame";
import { GameOptions } from "./gameOptions";

const scaleObject = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: "thegame",
  width: GameOptions.gameSize.width,
  height: GameOptions.gameSize.height,
};

const configObject = {
  type: Phaser.AUTO,
  backgroundColor: GameOptions.gameBackgroundColor,
  scale: scaleObject,
  scene: [PreloadAssets, PlayGame],
};

new Phaser.Game(configObject);
