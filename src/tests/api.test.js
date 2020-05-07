const { equal, isArray } = require('chai').assert
const Api = require('../api')
const Strategy = require('../db/base/strategy')
const MongoDB = require('../db/mongodb')
const model = require('../db/mongodb/model/heroes')

let App = {}

describe('API test suite', function () {
  this.beforeAll(async () => {
    App = await Api()
  })

  describe('GET /heroes', function () {
    const _route = {
      method: 'GET',
      url: '/heroes',
    }

    it('Can return all heroes in database', async () => {
      const result = await App.inject(_route)

      equal(result.statusCode, 200)
      isArray(JSON.parse(result.payload), 'The return is not an Array')
    })
  })

  describe('POST /heroes', function () {
    const _route = {
      method: 'POST',
      url: '/heroes',
    }

    const HERO_MOCK = {
      name: 'Superman',
      power: 'All powers from Krypton',
    }

    it('Can create a hero via request', async () => {
      const result = await App.inject({ ..._route, payload: HERO_MOCK })
      const { message } = JSON.parse(result.payload)

      equal(result.statusCode, 201)
      equal(message, 'Hero created')
    })

    it('Must throw a error', async () => {
      const result = await App.inject({
        ..._route,
        payload: { name: '', power: 'nothing' },
      })

      equal(result.statusCode, 400)
    })
  })

  describe('PATCH /heroes/id', function () {
    let MOCK_ID

    this.beforeAll(async () => {
      const connection = MongoDB.connect({
        user: 'user',
        pass: 'pass',
        db: 'heroes',
      })

      const mongoContext = new Strategy(new MongoDB(connection, model))
      const { _id } = await mongoContext.create({
        name: 'Batman',
        power: 'Weapons',
      })
      MOCK_ID = _id
    })

    const _route = {
      method: 'PATCH',
    }

    it('Can update hero data', async () => {
      const response = await App.inject({
        ..._route,
        url: `/heroes/${MOCK_ID}`,
        payload: {
          name: 'Iron Man',
        },
      })

      equal(response.statusCode, 200)
    })

    it('Must throw a error when try to update without id', async () => {
      const response = await App.inject({
        ..._route,
        url: `/heroes/`,
        payload: {
          name: 'Whatever',
        },
      })

      equal(response.statusCode, 404)
    })
  })

  describe('DELETE /heroes/id', function () {
    let MOCK_ID

    this.beforeAll(async () => {
      const connection = MongoDB.connect({
        user: 'user',
        pass: 'pass',
        db: 'heroes',
      })

      const mongoContext = new Strategy(new MongoDB(connection, model))
      const { _id } = await mongoContext.create({
        name: 'Spiderman',
        power: 'Web and technologies',
      })
      MOCK_ID = _id
    })

    const _route = {
      method: 'DELETE',
    }

    it('Must delete a hero from database', async () => {
      const response = await App.inject({
        ..._route,
        url: `/heroes/${MOCK_ID}`,
        payload: { id: MOCK_ID },
      })

      const { message } = JSON.parse(response.payload)

      equal(response.statusCode, 200)
      equal(message, 'Hero deleted')
    })

    it('Cannot delete a hero without id', async () => {
      const response = await App.inject({
        ..._route,
        url: `/heroes/`,
        payload: { id: MOCK_ID },
      })

      equal(response.statusCode, 404)
    })
  })
})
