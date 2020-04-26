const Interface = require('./interface')

class Strategy extends Interface {
  constructor(database) {
    super()
    this._database = database
  }

  async connect() {
    return this._database.connect()
  }

  create(data) {
    return this._database.create(data)
  }
  read(query) {
    return this._database.read(query)
  }
  update(id, data) {
    return this._database.update(id, data)
  }
  delete(id) {
    return this._database.delete(id)
  }
  async isConnected() {
    return this._database.isConnected()
  }
  drop() {
    return this._database.drop()
  }
}

module.exports = Strategy
