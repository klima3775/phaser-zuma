import gameOptions from "../gameOptions";
import { path } from "../curveLine";

// Класс PlayGame расширяет класс Phaser.Scene
class PlayGame extends Phaser.Scene {
  constructor() {
    super({
      key: "PlayGame",
    });
  }

  graphics; // объект графики, где будет отрисовываться путь
  path; // путь
  gems; // массив со всеми драгоценными камнями

  // метод, который будет вызван после создания экземпляра
  create() {
    // инициализация массива драгоценных камней
    this.gems = [];

    // создание пути и загрузка кривых из строки JSON
    this.path = new Phaser.Curves.Path(0, 0);
    this.path.fromJSON(JSON.parse(path));

    // получение длины пути в пикселях
    this.data.set("pathLength", this.path.getLength());

    // добавление графического объекта и отрисовка пути на нем
    this.graphics = this.add.graphics();
    this.graphics.lineStyle(2, 0xffffff, 1);
    this.path.draw(this.graphics);

    // добавление драгоценного камня
    this.addGem(0);
  }

  // метод для добавления драгоценного камня
  // t: время относительно пути, от 0 до 1, где 0 = в начале пути, а 1 = в конце пути
  addGem(t) {
    // получение начальной точки драгоценного камня
    const startPoint = this.path.getPoint(t);

    // создание спрайта в начальной точке драгоценного камня
    const gemSprite = this.add.sprite(startPoint.x, startPoint.y, "gem");

    // установка пользовательского свойства "t"
    gemSprite.setData("t", t);

    // добавление спрайта драгоценного камня в массив gemSprite
    this.gems.push(gemSprite);
  }

  // метод, который будет вызываться в каждом кадре
  // time: время, прошедшее с начала, в миллисекундах
  // deltaTime: время, прошедшее с последнего кадра, в миллисекундах
  update(time, deltaTime) {
    // определение движения delta t
    const deltaT =
      ((deltaTime / 1000) * gameOptions.gemSpeed) / this.data.get("pathLength");

    // перебор всех драгоценных камней
    this.gems.forEach((gem, index) => {
      // обновление данных t драгоценного камня
      gem.setData("t", gem.getData("t") + deltaT);

      // если драгоценный камень достиг конца пути
      if (gem.getData("t") > 1) {
        // перезапуск игры
        this.scene.start("PlayGame");
      }
      // если драгоценный камень не достиг конца пути
      else {
        // получение новой точки пути драгоценного камня
        const pathPoint = this.path.getPoint(gem.getData("t"));

        // перемещение драгоценного камня в новую точку пути
        gem.setPosition(pathPoint.x, pathPoint.y);

        // получение пройденного расстояния в пикселях
        const travelledDistance =
          this.data.get("pathLength") * gem.getData("t");

        // если это последний драгоценный камень и есть достаточно места для другого драгоценного камня
        if (
          index == this.gems.length - 1 &&
          travelledDistance > gameOptions.gemRadius * 2
        ) {
          // добавление драгоценного камня прямо за ним
          this.addGem(
            (travelledDistance - gameOptions.gemRadius * 2) /
              this.data.get("pathLength")
          );
        }
      }
    });
  }
}
export default PlayGame;
