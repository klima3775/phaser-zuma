import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.path = new Phaser.Curves.Path(100, 100);
    this.path.lineTo(700, 100);
    this.path.lineTo(700, 500);
    this.path.lineTo(100, 500);
    this.path.lineTo(100, 100);

    this.balls = this.physics.add.group({
      key: "ball",
      repeat: 20,
      setXY: { x: 100, y: 100, stepX: 30 },
    });

    this.balls.children.iterate((ball) => {
      this.tweens.add({
        targets: ball,
        x: 700,
        y: 500,
        duration: 5000,
        yoyo: true,
        repeat: -1,
      });
    });

    this.shooter = this.add.image(400, 550, "shooter");
    this.input.on("pointerdown", this.shootBall, this);
  }

  shootBall(pointer) {
    const ball = this.physics.add.image(this.shooter.x, this.shooter.y, "ball");
    this.physics.moveTo(ball, pointer.x, pointer.y, 600);
  }

  update() {
    this.physics.overlap(this.balls, this.balls, this.destroyBalls, null, this);
  }

  destroyBalls(ball1, ball2) {
    if (ball1.texture.key === ball2.texture.key) {
      ball1.destroy();
      ball2.destroy();
    }
  }
}
