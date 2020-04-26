const Interface = require('./base/interface')
const { Sequelize } = require('sequelize')

class Postgres extends Interface {
  constructor() {
    super()
    this._db = null
    this._model = null
    this._dbNAME = 'heroes'
    this._dbUSER = 'admin'
    this._dbPASS = 'admin'
    this.connect()
  }

  defineModel() {
    this._model = this._db.define(
      'heroes',
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        name: { type: Sequelize.STRING, required: true },
        power: { type: Sequelize.STRING, required: true },
      },
      {
        //opcoes para base existente
        tableName: 'HEROES',
        freezeTableName: false,
        timestamps: false,
      }
    )
  }

  connect() {
    this._db = new Sequelize(this._dbNAME, this._dbUSER, this._dbPASS, {
      dialect: 'postgres',
      host: 'localhost',
      quoteIdentifiers: false,
    })

    this.defineModel()
  }

  async isConnected() {
    try {
      await this._db.authenticate()
      return true
    } catch (error) {
      return false
    }
  }

  create(data) {
    return this._model.create(data, { raw: true })
  }

  read(query = {}) {
    return this._model.findAll({ where: query, raw: true })
  }

  async update(id, data) {
    delete data.id
    return await this._model.update(data, { where: { id } })
  }

  delete(query) {
    if (!query) {
      return false
    }
    return this._model.destroy({ where: { ...query } })
  }

  drop() {
    return this._model.destroy({ where: {} })
  }
}

module.exports = Postgres
