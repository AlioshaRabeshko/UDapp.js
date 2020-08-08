const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite:patients.db');

class Patients extends Model {}
Patients.init(
	{
		name: DataTypes.STRING,
		settle: DataTypes.STRING,
		birthday: DataTypes.DATE,
	},
	{ sequelize, modelName: 'patients' }
);

// sequelize.sync({ force: true });

module.exports = Patients;
