const Interface = require('./base/interface')
const Mongoose = require('mongoose')

class MongoDB extends Interface {
  constructor() {
    super()
    this._db = null
    this._model = null
    this._dbNAME = 'heroes'
    this._dbUSER = 'user'
    this._dbPASS = 'pass'
    this.connect()
  }

  async connect() {
    Mongoose.connect(
      `mongodb://${this._dbUSER}:${this._dbPASS}@localhost:27017/${this._dbNAME}`,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (!err) return
        console.log('MongoDB Connection error', err)
      }
    )
    this._db = Mongoose.connection
    this._db.once('open', () => console.log('MongoDB Connected'))
    this._defineModel()
  }

  _defineModel() {
    const scheema = new Mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      power: {
        type: String,
        required: true,
      },
      insertedAt: {
        type: Date,
        default: new Date(),
      },
    })

    // Mocha workaround
    this._model = Mongoose.models.heroes || Mongoose.model('heroes', scheema)
  }

  async isConnected() {
    // STATUS = {
    //   0: 'Disconnected',
    //   1: 'Connected',
    //   2: 'Connecting',
    //   3: 'Disconnecting',
    // }

    let status = this._db.readyState
    if (status === 2) {
      // Delay for wait the connection
      await new Promise((resolve) => setTimeout(resolve, 100))
      status = this._db.readyState
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
