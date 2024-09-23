// import { Scene } from 'phaser';

// export class GameOver extends Scene
// {
//     constructor ()
//     {
//         super('GameOver');
//     }

//     create ()
//     {
//         this.cameras.main.setBackgroundColor(0xff0000);

//         this.add.image(512, 384, 'background').setAlpha(0.5);

//         this.add.text(512, 384, 'Game Over', {
//             fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
//             stroke: '#000000', strokeThickness: 8,
//             align: 'center'
//         }).setOrigin(0.5);

//         this.input.once('pointerdown', () => {

//             this.scene.start('MainMenu');

//         });
//     }
// }
export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.add
      .text(400, 300, "Game Over", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);

    const restartButton = this.add
      .text(400, 400, "Restart", { fontSize: "24px", fill: "#0f0" })
      .setOrigin(0.5);
    restartButton.setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.start("Game");
    });
  }
}
