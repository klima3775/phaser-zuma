import GameOptions from "../gameOptions";

export default class PlayGame extends Phaser.Scene {
  constructor() {
    super({ key: "PlayGame" });
  }

  create() {
    this.gems = []; // Инициализация массива для хранения драгоценных камней

    // Создание пути и загрузка кривых из объекта
    this.path = new Phaser.Curves.Path(0, 0);
    this.path.fromJSON(GameOptions.path);

    // Получение длины пути в пикселях и сохранение в данных сцены
    this.data.set("pathLength", this.path.getLength());

    // Создание графического объекта и отрисовка пути на нем
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2, 0xffffff, 1); // Установка стиля линии
    this.path.draw(this.graphics); // Отрисовка пути

    // Добавление первого драгоценного камня
    this.addGem(0);
  }

  // // Метод для добавления драгоценного камня

  addGem(t) {
    const startPoint = this.path.getPoint(t);

    // Выбор случайного цвета из массива gemColor
    const randomColorIndex = Math.floor(
      Math.random() * GameOptions.gemColor.length
    );
    const gemColor = GameOptions.gemColor[randomColorIndex];

    // Создание драгоценного камня с цветом
    const gemSprite = this.add.sprite(startPoint.x, startPoint.y, "gem");

    // Применение цвета с помощью tint
    gemSprite.setTint(gemColor);

    gemSprite.setData("t", t);
    this.gems.push(gemSprite);
  }

  // Метод, который будет вызываться на каждом кадре
  update(time, deltaTime) {
    const deltaT =
      ((deltaTime / 1000) * GameOptions.gemSpeed) / this.data.get("pathLength");

    // Перебор всех драгоценных камней
    this.gems.forEach((gem, index) => {
      // Обновление данных "t" драгоценного камня
      gem.setData("t", gem.getData("t") + deltaT);

      // Если драгоценный камень достиг конца пути
      if (gem.getData("t") > 1) {
        // Перезапуск игры
        this.scene.start("PlayGame");
      } else {
        // Если драгоценный камень не достиг конца пути

        // Получение новой точки пути драгоценного камня
        const pathPoint = this.path.getPoint(gem.getData("t"));

        // Перемещение драгоценного камня в новую точку пути
        gem.setPosition(pathPoint.x, pathPoint.y);

        // Получение пройденного расстояния в пикселях
        const travelledDistance =
          this.data.get("pathLength") * gem.getData("t");

        // Если это последний драгоценный камень и есть достаточно места для другого драгоценного камня
        if (
          index == this.gems.length - 1 &&
          travelledDistance > GameOptions.gemRadius * 2
        ) {
          // Добавление драгоценного камня прямо за ним
          this.addGem(
            (travelledDistance - GameOptions.gemRadius * 2) /
              this.data.get("pathLength")
          );
        }
      }
    });
  }
}
