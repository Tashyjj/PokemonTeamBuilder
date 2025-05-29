'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Team.init({
    team_name: DataTypes.STRING,
    pokemon_list: DataTypes.TEXT,
    types_summary: DataTypes.TEXT,
    moves_stats: DataTypes.TEXT,
    effectiveness: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true
  });
  return Team;
};