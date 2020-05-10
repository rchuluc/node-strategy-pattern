const Sequelize = require('sequelize')

module.exports = {
  name: 'users',
  constructor: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: Sequelize.STRING, required: true, unique: true },
    password: { type: Sequelize.STRING, required: true },
  },
  options: {
    tableName: 'users',
    freezeTableName: false,
    timestamps: false,
  },
}
