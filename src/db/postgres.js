const Interface = require('./base/interface')
const { Sequelize, Model } = require('sequelize')

class Hero extends Model {}

Hero.init({
  id: {
    type: Sequelize.INTEGER,
    required: true,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: Sequelize.STRING, required: true },
  power: { type: Sequelize.STRING, required: true },
})
class Postgres extends Interface {
  constructor() {
    super()
    this._db = null
    this._model = null
    this._dbNAME = 'postgres'
    this._dbUSER = 'admin'
    this._dbPASS = 'admin'
  }

  _defineModel() {
    this._model = this._db.define('heroes', new Hero())
  }

  _conect() {
    this._db = new Sequelize(this._dbNAME, this._dbUSER, this._dbPASS, {
      dialect: 'postgres',
      host: 'localhost',
      quoteIdentifiers: false,
      operatorsAliases: false,
    })

    this._defineModel()
  }

  create(data) {
    console.log('Postgres Create')
    return 'Postgres Create'
  }
}

module.exports = Postgres
