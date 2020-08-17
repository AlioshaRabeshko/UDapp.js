const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:forms.db');

class Forms extends Model {}
Forms.init(
  {
    name: DataTypes.STRING,
    form: DataTypes.TEXT,
    docxName: DataTypes.STRING,
  },
  { sequelize, modelName: 'forms' }
);

const forms = [
  {
    name: 'Обстеження органів сечовидільної системи',
    form:
      '{"name":"Обстеження органів сечовидільної системи","count":28,"blocks":[{"name":"Ліва нирка","inputs":[{"type":"radio","prelabel":"Розміщена:","values":["Типово","Нетипово","Нефроптоз І","Нефроптоз ІІ"]},{"type":"inputxinput","prelabel":"Розміри:","afterlabel":"мм"},{"type":"input","prelabel":"Паренхіма:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Шари диференціюються:","values":["Чітко","Нечітко"]},{"type":"radio","prelabel":"Співвідношення паренхіми до ЧМС:","values":["3:1","2:1","1:1"]},{"type":"input","prelabel":"ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:","afterlabel":"мм"},{"type":"radio","prelabel":"Конкременти:","values":["Виявлено","Невиявлено"]}]},{"name":"Права нирка","inputs":[{"type":"radio","prelabel":"Розміщена:","values":["Типово","Нетипово","Нефроптоз І","Нефроптоз ІІ"]},{"type":"inputxinput","prelabel":"Розміри:","afterlabel":"мм"},{"type":"input","prelabel":"Паренхіма:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Шари диференціюються:","values":["Чітко","Нечітко"]},{"type":"radio","prelabel":"Співвідношення паренхіми до ЧМС:","values":["3:1","2:1","1:1"]},{"type":"input","prelabel":"ЧМК ущільнений за рахунок дрібних ехопозитивних структур розміром до:","afterlabel":"мм"},{"type":"radio","prelabel":"Конкременти:","values":["Виявлено","Невиявлено"]}]},{"name":"Сечовий міхур","inputs":[{"type":"radio","values":["Виповнений","Невиповнений"]},{"type":"input","prelabel":"V","afterlabel":"мм"},{"type":"input","prelabel":"Vзал","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Вміст","values":["Однорідний","Неоднорідний"]},{"type":"input","prelabel":"Стінки","afterlabel":"мм"},{"type":"radio","prelabel":"Сечоводи","values":["Нерозширені","Розширені  "]}]}]}',
    docxName: 'tmp3.docx',
  },
  {
    name: 'Обстеження органів черевної порожнини',
    form:
      '{"name":"Обстеження органів черевної порожнини","count":29,"blocks":[{"name":"Печінка","inputs":[{"type":"input","prelabel":"Ліва доля:","afterlabel":"мм"},{"type":"input","prelabel":"Права доля:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Краї:","values":["Типово","Нетипово"]},{"type":"radio","prelabel":"Ехоструктура:","values":["Дрібнозерниста","Однорідна","Неоднорідна"]},{"type":"radio","prelabel":"Ехогенність:","values":["Підвищена","Знижена","Без змін"]},{"type":"input","prelabel":"Ворітка вежа:","afterlabel":"мм"},{"type":"input","prelabel":"НПВ:","afterlabel":"мм"},{"type":"input","prelabel":"Холедох:","afterlabel":"мм"}]},{"name":"Жовчний міхур","inputs":[{"type":"radio","prelabel":"Розміщена:","values":["Визначається","Не визначається"]},{"type":"input","prelabel":"Розміри:","afterlabel":"мм"},{"type":"input","prelabel":"Стінки:","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]}]},{"name":"Підшлункова залоза","inputs":[{"type":"radio","prelabel":"Візуалізація:","values":["Візуалізується","Не візуалізується"]},{"type":"radio","prelabel":"Візуалізація:","values":["Повністю","Неповністю"]},{"type":"inputxinputxinput","prelabel":"Розміри","afterlabel":"мм"},{"type":"radio","prelabel":"Структура:","values":["Однорідна","Неоднорідна"]},{"type":"radio","prelabel":"Ехогенність:","values":["Підвищена","Знижена","Без змін"]},{"type":"input","prelabel":"Панкреатична протока","afterlabel":"мм"}]},{"name":"Селезінка","inputs":[{"type":"input","prelabel":"Розміри","afterlabel":"мм"},{"type":"radio","prelabel":"Контури:","values":["Чіткі","Нечіткі"]},{"type":"radio","prelabel":"Контури:","values":["Рівні","Нерівні"]},{"type":"radio","prelabel":"Ехоструктура:","values":["Дрібнозерниста","Однорідна","Неоднорідна"]},{"type":"radio","prelabel":"Ехогенність:","values":["Підвищена","Знижена","Без змін"]},{"type":"input","prelabel":"Селезінкова вежа у воротах селезінки","afterlabel":"мм"}]}]}',
    docxName: 'tmp2.docx',
  },
];

sequelize.sync().then(() =>
  forms.forEach((el) =>
    sequelize.models.forms.findOrCreate({
      where: { name: el.name },
      defaults: { ...el },
    })
  )
);

module.exports = Forms;
