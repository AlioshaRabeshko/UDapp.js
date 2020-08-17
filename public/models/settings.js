const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:settings.db');

class Settings extends Model {}
Settings.init(
  {
    property: DataTypes.STRING,
    title: DataTypes.STRING,
    value: DataTypes.TEXT,
  },
  { sequelize, modelName: 'settings' }
);

sequelize.sync();
const settings = [
  {
    property: 'doctor',
    value: '',
    title: "Ім'я лікаря",
  },
  {
    property: 'device',
    value: '',
    title: 'Назва пристрою',
  },
  {
    property: 'resolution',
    value: '1280x720',
    title: 'Розширення екрану',
  },
  {
    property: 'screen',
    value: 'window',
    title: 'Екран',
  },
];

settings.forEach(
  async (el) =>
    await forms.forEach(
      async (el) =>
        await sequelize.models.settings.findOrCreate({
          where: { property: el.property },
          defaults: { ...el },
        })
    )
);

module.exports = Settings;
