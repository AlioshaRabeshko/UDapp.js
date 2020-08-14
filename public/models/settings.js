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

// sequelize.sync({ force: true });

module.exports = Settings;
