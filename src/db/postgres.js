const Interface = require('./base/interface')

class Postgres extends Interface {
  constructor() {
    super()
  }

  create(data) {
    console.log('Postgres Create')
    return 'Postgres Create'
  }
}

module.exports = Postgres
