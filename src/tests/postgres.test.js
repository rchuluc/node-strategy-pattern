const { equal, deepEqual, isAbove } = require('chai').assert
const Strategy = require('../db/base/strategy')
const Postgres = require('../db/postgres')
const heroesModel = require('../db/postgres/model/heroes')

let PostgresContext = {}

const CREATE_MOCK = { name: 'Batman', power: 'Money' }
const UPDATE_MOCK = { name: 'Aquaman', power: 'Talk to sea Creatures' }

describe('Postgres SQL test suite', function () {
  this.timeout(Infinity)
  this.beforeAll(() => {
    const connection = Postgres.connect({
      db: 'heroes',
    })

    PostgresContext = new Strategy(new Postgres(connection, heroesModel))

    PostgresContext.drop()

    PostgresContext.create(CREATE_MOCK)
    PostgresContext.create(UPDATE_MOCK)
  })

  it('Has connection', async () => {
    const result = await PostgresContext.isConnected()
    equal(result, true)
  })

  it('Can create a record on DB', async () => {
    const { dataValues: result } = await PostgresContext.create(CREATE_MOCK)
    delete result.id

    deepEqual(result, CREATE_MOCK)
  })

  it('Can retrieve record from DB', async () => {
    const [result] = await PostgresContext.read({ name: CREATE_MOCK.name })
    delete result.id

    deepEqual(result, CREATE_MOCK)
  })

  it('Can update an existing record', async () => {
    const [result] = await PostgresContext.read({ name: CREATE_MOCK.name })
    const update = {
      ...result,
      name: 'Iron Man',
    }
    await PostgresContext.update(result.id, update)

    const [updated] = await PostgresContext.read({ name: update.name })
    delete updated.id

    deepEqual(updated, update)
  })

  it('Can delete an record', async () => {
    const [record] = await PostgresContext.read()

    const result = await PostgresContext.delete(record.id)
    isAbove(result, 1)
  })

  it('Cannot delete an record without id', async () => {
    const result = await PostgresContext.delete()

    equal(result, false)
  })
})
