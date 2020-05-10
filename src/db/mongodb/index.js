require('../../config')
const Interface = require('../base/interface')
const Mongoose = require('mongoose')

class MongoDB extends Interface {
  constructor(connection, model) {
    super()
    this._connection = connection
    this._model = model
  }

  static connect({ db }) {
    Mongoose.connect(
      `${process.env.MONGO_URI}${db}`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (!err) return
        console.log(`${uri}${db}`)
        console.log('MongoDB Connection error', err)
      }
    )
    const connection = Mongoose.connection
    if (process.env.NODE_ENV !== 'test') {
      connection.once('open', () => console.log('MongoDB Connected'))
    }
    return connection
  }

  async isConnected() {
    // STATUS = {
    //   0: 'Disconnected',
    //   1: 'Connected',
    //   2: 'Connecting',
    //   3: 'Disconnecting',
    // }

    let status = this._connection.readyState
    if (status === 2) {
      // Delay for wait the connection
      await new Promise((resolve) => setTimeout(resolve, 100))
      status = this._connection.readyState
    }
    return status === 1 ? true : false
  }

  async create(data) {
    return await this._model.create(data)
  }

  async read(query = {}) {
    return await this._model.find(query, { name: 1, power: 1, insertedAt: 1 })
  }

  async update(id, data) {
    return await this._model.updateOne({ _id: id }, { $set: data })
  }

  async delete(id) {
    return await this._model.deleteOne({ _id: id })
  }

  async drop() {
    return await this._model.dropCollection
  }
}

module.exports = MongoDB
