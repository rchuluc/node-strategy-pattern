const Interface = require('./base/interface')

class MongoDB extends Interface {
  constructor() {
    super()
  }

  create(data) {
    console.log('MongoDB Create')
    return 'MongoDB Create'
  }
}

module.exports = MongoDB
