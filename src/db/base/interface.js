//Custom error class
class StrategyError extends Error {
  constructor() {
    super('This strategy is not implemented')
  }
}

//interface
class Interface {
  create(data) {
    throw new StrategyError()
  }
  read(query) {
    throw new StrategyError()
  }
  update(id, data) {
    throw new StrategyError()
  }
  delete(id) {
    throw new StrategyError()
  }
  isConnected() {
    throw new StrategyError()
  }
}

module.exports = Interface
