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

// sequelize.sync({ force: true });

module.exports = Forms;
