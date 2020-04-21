const assert = require('assert')
const Strategy = require('./db/base/strategy')
const Postgres = require('./db/postgres')

const PostgresContext = new Strategy(new Postgres())

describe('Postgres SQL test suite', () => {
  it('Has connection', async () => {})
})
