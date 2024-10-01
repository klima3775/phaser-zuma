import path from "./curveLine.js";

const GameOptions = {
  gameSize: {
    width: 1920,
    height: 1080,
  },

  gemColor: [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00, 0x00ffff],
  gameBackgroundColor: 0x222222,
  path: path,
  gemSpeed: 120,
  gemRadius: 24,
};

export default GameOptions;
