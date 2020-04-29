const Interface = require('../base/interface')
const { Sequelize } = require('sequelize')

class Postgres extends Interface {
  constructor(connection, model) {
    super()
    this._connection = connection
    this._model = this._connection.define(
      model.name,
      model.constructor,
      model.options
    )
    this._model.sync()
  }

  static connect({ user, pass, db }) {
    return new Sequelize(db, user, pass, {
      dialect: 'postgres',
      host: 'localhost',
      quoteIdentifiers: false,
      logging: false,
    })
  }

  async isConnected() {
    try {
      await this._connection.authenticate()
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
