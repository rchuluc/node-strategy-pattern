const Mongoose = require('mongoose')

const model = new Mongoose.Schema({
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

Mongoose.models = {} //Mocha workarround
module.exports = Mongoose.model.heroes || Mongoose.model('heroes', model)
