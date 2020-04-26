const { equal, deepEqual, isAbove, isArray } = require('chai').assert
const Strategy = require('../db/base/strategy')
const MongoDB = require('../db/mongoDB')

const MongoContext = new Strategy(new MongoDB())

const CREATE_MOCK = { name: 'Batman', power: 'Money' }
let UPDATE_MOCK_ID

describe.only('MongoDB test suite', function () {
  this.beforeAll(async () => {
    await MongoContext.drop()
    const { _id } = await MongoContext.create(CREATE_MOCK)
    UPDATE_MOCK_ID = _id
  })

  it('Has connection', async () => {
    const result = await MongoContext.isConnected()
    equal(result, true)
  })

  it('Can create a object in collection', async () => {
    const { name, power } = await MongoContext.create(CREATE_MOCK)
    deepEqual({ name, power }, CREATE_MOCK)
  })

  it('Can read all objects', async () => {
    const objects = await MongoContext.read()
    isArray(objects)
  })

  it('Can find one record', async () => {
    const target = CREATE_MOCK.name
    const [{ name, power }] = await MongoContext.read({ name: target })
    deepEqual({ name, power }, CREATE_MOCK)
  })

  it('Can update a existing object', async () => {
    const data = { name: 'Iron Man' }
    const { nModified } = await MongoContext.update(UPDATE_MOCK_ID, data)
    equal(nModified, 1)
  })

  it('Can delete an object', async () => {
    const id = UPDATE_MOCK_ID
    const result = await MongoContext.delete(id)
    equal(result.n, 1)
  })
})
