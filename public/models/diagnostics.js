const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite:diagnostics.db");

class Diagnostics extends Model {}
Diagnostics.init(
  {
    patientId: DataTypes.INTEGER,
    diagnosticId: DataTypes.INTEGER,
    data: DataTypes.TEXT,
  },
  { sequelize, modelName: "diagnostics" }
);

sequelize.sync();

module.exports = Diagnostics;
