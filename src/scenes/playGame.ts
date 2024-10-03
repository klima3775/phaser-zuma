import { GameOptions } from "../gameOptions";

// Перечисление режимов игры
enum gameMode {
  IDLE, // Ожидание
  FIRING, // Стрельба
  HIT, // Попадание
  STOP, // Остановка
}

export class PlayGame extends Phaser.Scene {
  constructor() {
    super({
      key: "PlayGame",
    });
  }

  graphics: Phaser.GameObjects.Graphics; // Графика для рисования пути
  path: Phaser.Curves.Path; // Путь, по которому движутся шары
  balls: any[] = []; // Массив шаров
  gemBullet: Phaser.GameObjects.Sprite; // Шар, который игрок стреляет
  debugText: Phaser.GameObjects.Text; // Текст для отладки

  create(): void {
    // Инициализация пути
    this.path = new Phaser.Curves.Path(0, 0);
    this.path.fromJSON(JSON.parse(GameOptions.path));

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
      (this.game.config.width as number) / 2,
      (this.game.config.height as number) / 2,
      "gem"
    );
    this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));

    // Обработчик событий нажатия
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      switch (this.data.get("gameMode")) {
        case gameMode.IDLE: // Если в режиме ожидания
          this.data.set("gameMode", gameMode.FIRING);
          this.debugText.setText("FIRING");

          // Создание линии стрельбы
          const lineOfFire: Phaser.Geom.Line = new Phaser.Geom.Line(
            this.gemBullet.x,
            this.gemBullet.y,
            pointer.x,
            pointer.y
          );

          // Установка угла стрельбы
          this.gemBullet.setData("angle", Phaser.Geom.Line.Angle(lineOfFire));
          break;

        case gameMode.STOP: // Если в режиме остановки
          this.data.set("gameMode", gameMode.HIT);
          break;
      }
    });

    // Текст для отладки
    this.debugText = this.add.text(32, 32, "CLICK OR TAP TO FIRE", {
      color: "#00ff00",
      fontSize: 32,
    });
  }

  // Метод для добавления нового шара
  addBall(t: number, color: number): void {
    const startPoint: Phaser.Math.Vector2 = this.path.getPoint(t);
    const ballSprite: Phaser.GameObjects.Sprite = this.add.sprite(
      startPoint.x,
      startPoint.y,
      "gem"
    );
    ballSprite.setTint(color); // Установка цвета шара
    ballSprite.setData("t", t);
    ballSprite.setData("color", color);

    this.balls.push(ballSprite); // Добавление шара в массив
    this.checkForMatches(); // Проверка на совпадения
  }

  // Метод для проверки совпадений между шарами
  checkForMatches(): void {
    let count = 1;
    let start = 0;

    for (let i = 1; i < this.balls.length; i++) {
      if (
        this.balls[i].getData("color") === this.balls[i - 1].getData("color")
      ) {
        count++;
      } else {
        if (count >= 3) {
          this.removeBalls(start, count); // Удаление совпадающих шаров
        }
        count = 1; // Сброс счетчика
        start = i; // Установка начальной позиции
      }
    }

    if (count >= 3) {
      this.removeBalls(start, count); // Удаление последних совпадений
    }
  }

  // Метод для удаления шаров
  removeBalls(start: number, count: number): void {
    for (let i = 0; i < count; i++) {
      this.balls[start + i].destroy(); // Удаление шара из сцены
    }
    this.balls.splice(start, count); // Удаление из массива
  }

  // Основной метод обновления
  update(time: number, deltaTime: number) {
    if (this.data.get("gameMode") == gameMode.STOP) {
      return; // Если в режиме остановки, ничего не делаем
    }

    const deltaT: number =
      ((deltaTime / 1000) * GameOptions.gemSpeed) / this.data.get("pathLength");

    if (this.data.get("gameMode") == gameMode.FIRING) {
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
        this.gemBullet.x >
          (this.game.config.width as number) + GameOptions.gemRadius ||
        this.gemBullet.y >
          (this.game.config.height as number) + GameOptions.gemRadius
      ) {
        // Возврат шарика в центр
        this.gemBullet.setPosition(
          (this.game.config.width as number) / 2,
          (this.game.config.height as number) / 2
        );
        this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor));
        this.data.set("gameMode", gameMode.IDLE);
        this.debugText.setText("CLICK OR TAP TO FIRE");
      }
    }

    // Обновление всех шаров
    this.balls.forEach((ball: Phaser.GameObjects.Sprite, index: number) => {
      ball.setAlpha(1); // Установка альфа-канала
      ball.setData("t", ball.getData("t") + deltaT); // Обновление позиции по пути

      if (ball.getData("t") > 1) {
        // Если шар выходит за пределы пути
        this.scene.start("PlayGame"); // Перезапуск сцены
      } else {
        const pathPoint: Phaser.Math.Vector2 = this.path.getPoint(
          ball.getData("t")
        );
        ball.setPosition(pathPoint.x, pathPoint.y); // Установка новой позиции шара

        const vector: Phaser.Math.Vector2 = this.path.getTangent(
          ball.getData("t")
        );
        ball.setRotation(vector.angle()); // Установка угла поворота шара

        if (this.data.get("gameMode") == gameMode.FIRING) {
          const distance: number = Phaser.Math.Distance.Squared(
            ball.x,
            ball.y,
            this.gemBullet.x,
            this.gemBullet.y
          );

          if (distance < GameOptions.gemRadius * 4 * GameOptions.gemRadius) {
            this.data.set("gameMode", gameMode.HIT); // Если произошло попадание
            ball.alpha = 0.5; // Уменьшаем видимость шара

            const angle: number = Phaser.Math.RadToDeg(
              Phaser.Math.Angle.Between(
                this.gemBullet.x,
                this.gemBullet.y,
                ball.x,
                ball.y
              )
            );

            const relativeAngle: number = Phaser.Math.Angle.WrapDegrees(
              angle - ball.angle
            );

            // Определяем, куда вставить новый шар
            this.data.set(
              "insertInPlace",
              relativeAngle < -90 ? index : index + 1
            );

            // Отладочный текст
            this.debugText.setText(
              "COLLISION\n\nItem number " +
                index +
                "\n\nAngle between\nbullet and item: " +
                Math.round(angle) +
                "\n\nAngle of\npath tangent: " +
                Math.round(ball.angle) +
                "\n\nRelative angle: " +
                Math.round(relativeAngle) +
                "\n\nMust be placed\n" +
                (relativeAngle < -90 ? "BEFORE" : "AFTER") +
                "\nat position " +
                this.data.get("insertInPlace") +
                "\n\nFIRE TO CONTINUE"
            );

            this.data.set("gameMode", gameMode.STOP); // Переход в режим остановки
          }
        }

        // Добавление нового шара при достижении конца пути
        const travelledDistance: number =
          this.data.get("pathLength") * ball.getData("t");

        if (
          index == this.balls.length - 1 &&
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

    // Обработка попадания
    if (this.data.get("gameMode") == gameMode.HIT) {
      const gemT: number =
        (GameOptions.gemRadius * 2) / this.data.get("pathLength");

      // Сдвиг всех шаров до места вставки
      for (let i: number = 0; i < this.data.get("insertInPlace"); i++) {
        this.balls[i].setData("t", this.balls[i].getData("t") + gemT); // Обновление t
        const pathPoint: Phaser.Math.Vector2 = this.path.getPoint(
          this.balls[i].getData("t")
        );
        this.balls[i].setPosition(pathPoint.x, pathPoint.y); // Установка новой позиции
      }

      // Добавление нового шара
      // this.addBall(
      //   this.balls[this.data.get("insertInPlace")].getData("t") + gemT,
      //   this.gemBullet.tint // Использование цвета из шарика
      // );

      // Возврат шарика игрока в центр
      this.gemBullet.setPosition(
        (this.game.config.width as number) / 2,
        (this.game.config.height as number) / 2
      );
      this.gemBullet.setTint(Phaser.Math.RND.pick(GameOptions.gemColor)); // Установка нового цвета
      this.data.set("gameMode", gameMode.IDLE);
      this.debugText.setText("CLICK OR TAP TO FIRE"); // Сброс текста
    }
  }
}

export default PlayGame;
