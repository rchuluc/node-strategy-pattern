const Interface = require('./interface')

class Strategy extends Interface {
  constructor(database) {
    super()
    this._database = database
  }

  create(data) {
    this._database.create(data)
  }
  read(query) {
    this._database.read(query)
  }
  update(id, data) {
    this._database.update(id, data)
  }
  delete(id) {
    this._database.delete(id)
  }
  isConnected() {
    this._database.isConnected()
  }
}

module.exports = Strategy
