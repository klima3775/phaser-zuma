import { GameOptions } from "../gameOptions";

const gameMode = {
  FIRING: 1, // Стрельба
  HIT: 2, // Попадание
  STOP: 3, // Остановка
};

export class PlayGame extends Phaser.Scene {
  constructor() {
    super({
      key: "PlayGame",
    });

    this.graphics = null; // Графика для рисования пути
    this.path = null; // Путь, по которому движутся шары
    this.balls = []; // Массив шаров
    this.gemBullet = null; // Шар, который игрок стреляет
    this.debugText = null; // Текст для отладки
  }

  create() {
    const background = this.add.image(0, 0, "bg").setOrigin(0, 0);
    background.setDisplaySize(this.game.config.width, this.game.config.height);

    const music = this.sound.add("Zuma");
    music.play();

    // Инициализация пути
    this.path = new Phaser.Curves.Path(0, 0);
    this.path.fromJSON(GameOptions.path);

    // Установка длины пути и режима игры
    this.data.set("pathLength", this.path.getLength());
    this.data.set("gameMode", gameMode.IDLE);

    // Рисование пути
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2, 0xffffff, 1);
    this.path.draw(this.graphics);

    // Добавление первого шара
    this.addBall(0, Phaser.Math.RND.pick(GameOptions.gemColor));

    // Создание шарика игрока
    this.gemBullet = this.add.sprite(
      this.game.config.width / 2,
      this.game.config.height / 2,
      "gem"
    );
    this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));

    // Обработчик событий нажатия
    this.input.on("pointerdown", (pointer) => {
      if (this.data.get("gameMode") === gameMode.IDLE) {
        this.data.set("gameMode", gameMode.FIRING);
        this.debugText.setText("FIRING");

        // Создание линии стрельбы
        const lineOfFire = new Phaser.Geom.Line(
          this.gemBullet.x,
          this.gemBullet.y,
          pointer.x,
          pointer.y
        );

        // Установка угла стрельбы
        this.gemBullet.setData("angle", Phaser.Geom.Line.Angle(lineOfFire));
      }
    });

    // Текст для отладки
    this.debugText = this.add.text(32, 32, "CLICK OR TAP TO FIRE", {
      color: "#00ff00",
      fontSize: 32,
    });
  }

  // Метод для добавления нового шара
  addBall(t, color) {
    const startPoint = this.path.getPoint(t);
    const ballSprite = this.add.sprite(startPoint.x, startPoint.y, "gem");
    ballSprite.setTint(color); // Установка цвета шара
    ballSprite.setData("t", t);
    ballSprite.setData("color", color);

    this.balls.push(ballSprite); // Добавление шара в массив
  }

  // Метод для удаления шара
  removeBall(index) {
    if (this.balls[index]) {
      this.balls[index].destroy(); // Удаление шара из сцены
      this.balls.splice(index, 1); // Удаление из массива
    }
  }

  // Основной метод обновления
  update(time, deltaTime) {
    if (this.data.get("gameMode") === gameMode.STOP) {
      return; // Если в режиме остановки, ничего не делаем
    }

    const deltaT =
      ((deltaTime / 1000) * GameOptions.gemSpeed) / this.data.get("pathLength");

    if (this.data.get("gameMode") === gameMode.FIRING) {
      // Обновление позиции шарика игрока
      this.gemBullet.x +=
        ((GameOptions.bulletSpeed * deltaTime) / 1000) *
        Math.cos(this.gemBullet.getData("angle"));
      this.gemBullet.y +=
        ((GameOptions.bulletSpeed * deltaTime) / 1000) *
        Math.sin(this.gemBullet.getData("angle"));

      // Проверка выхода за пределы
      if (
        this.gemBullet.x < -GameOptions.gemRadius ||
        this.gemBullet.y < -GameOptions.gemRadius ||
        this.gemBullet.x > this.game.config.width + GameOptions.gemRadius ||
        this.gemBullet.y > this.game.config.height + GameOptions.gemRadius
      ) {
        // Возврат шарика в центр
        this.gemBullet.setPosition(
          this.game.config.width / 2,
          this.game.config.height / 2
        );
        this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));
        this.data.set("gameMode", gameMode.IDLE);
        this.debugText.setText("CLICK OR TAP TO FIRE");
      }
    }

    // Обновление всех шаров
    this.balls.forEach((ball, index) => {
      ball.setData("t", ball.getData("t") + deltaT); // Обновление позиции по пути

      if (ball.getData("t") > 1) {
        // Если шар выходит за пределы пути
        this.time.delayedCall(100, () => {
          this.scene.start("GameOver"); // Запуск новой сцены через 5 секунд
        });
      } else {
        const pathPoint = this.path.getPoint(ball.getData("t"));

        // Проверка на валидность pathPoint
        if (pathPoint) {
          ball.setPosition(pathPoint.x, pathPoint.y); // Установка новой позиции шара

          const vector = this.path.getTangent(ball.getData("t"));
          ball.setRotation(vector.angle()); // Установка угла поворота шара
        } else {
          console.warn(`Invalid pathPoint for t=${ball.getData("t")}`);
        }

        // Проверка на столкновение с шариком игрока
        if (this.data.get("gameMode") === gameMode.FIRING) {
          const distance = Phaser.Math.Distance.Squared(
            ball.x,
            ball.y,
            this.gemBullet.x,
            this.gemBullet.y
          );

          // Если произошло попадание
          if (distance < GameOptions.gemRadius * 4 * GameOptions.gemRadius) {
            this.data.set("gameMode", gameMode.HIT);
            this.removeBall(index); // Удаление шара

            // Возврат шарика игрока в центр
            this.gemBullet.setPosition(
              this.game.config.width / 2,
              this.game.config.height / 2
            );
            this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));
            this.data.set("gameMode", gameMode.IDLE);
            this.debugText.setText("CLICK OR TAP TO FIRE");
          }
        }

        // Добавление нового шара при достижении конца пути
        const travelledDistance =
          this.data.get("pathLength") * ball.getData("t");

        if (
          index === this.balls.length - 1 &&
          travelledDistance > GameOptions.gemRadius * 2
        ) {
          this.addBall(
            (travelledDistance - GameOptions.gemRadius * 2) /
              this.data.get("pathLength"),
            Phaser.Math.RND.pick(GameOptions.gemColor)
          );
        }
      }
    });
  }
}

export default PlayGame;
