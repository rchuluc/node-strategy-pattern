const { equal, isArray } = require('chai').assert
const Api = require('../api')
const Strategy = require('../db/base/strategy')
const MongoDB = require('../db/mongodb')
const Postgres = require('../db/postgres')
const model = require('../db/mongodb/model/heroes')
const userModel = require('../db/postgres/model/users')
const Faker = require('faker')
const PasswordHelper = require('../utils/passwordHelper')
const JWT = require('jsonwebtoken')

let App = {}
let headers

describe('API test suite', function () {
  this.beforeAll(async () => {
    App = await Api()

    const connection = Postgres.connect({ db: 'users' })
    const postgresContext = new Strategy(new Postgres(connection, userModel))
    const [user] = await postgresContext.read()
    const token = JWT.sign(
      {
        username: user.username,
      },
      process.env.JWT_KEY
    )
    headers = { Authorization: token }
  })

  describe('GET /heroes', function () {
    const _route = {
      method: 'GET',
      url: '/heroes',
    }

    it('Can return all heroes in database', async () => {
      const result = await App.inject({ ..._route, headers })
      equal(result.statusCode, 200)
      isArray(JSON.parse(result.payload), 'The return is not an Array')
    })

    it("Can't access without token", async () => {
      const result = await App.inject({ ..._route })
      equal(result.statusCode, 401)
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
      const result = await App.inject({
        ..._route,
        headers,
        payload: HERO_MOCK,
      })
      const { message } = JSON.parse(result.payload)

      equal(result.statusCode, 201)
      equal(message, 'Hero created')
    })

    it('Must throw a error', async () => {
      const result = await App.inject({
        ..._route,
        headers,
        payload: { name: '', power: 'nothing' },
      })

      equal(result.statusCode, 400)
    })

    it("Can't access without token", async () => {
      const result = await App.inject({
        ..._route,
        payload: HERO_MOCK,
      })

      equal(result.statusCode, 401)
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
        headers,
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
        headers,
        url: `/heroes/`,
        payload: {
          name: 'Whatever',
        },
      })

      equal(response.statusCode, 404)
    })

    it("Can't access without token", async () => {
      const response = await App.inject({
        ..._route,
        url: `/heroes/${MOCK_ID}`,
        payload: {
          name: 'Iron Man',
        },
      })

      equal(response.statusCode, 401)
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
        headers,
        url: `/heroes/${MOCK_ID}`,
      })

      const { message } = JSON.parse(response.payload)

      equal(response.statusCode, 200)
      equal(message, 'Hero deleted')
    })

    it('Cannot delete a hero without id', async () => {
      const response = await App.inject({
        ..._route,
        headers,
        url: `/heroes/`,
      })

      equal(response.statusCode, 404)
    })

    it("Can't access without token", async () => {
      const response = await App.inject({
        ..._route,
        url: `/heroes/${MOCK_ID}`,
      })

      equal(response.statusCode, 401)
    })
  })

  describe('POST /login', function () {
    let _user

    this.beforeAll(async () => {
      const connection = Postgres.connect({ db: 'users' })
      const postgresContext = new Strategy(new Postgres(connection, userModel))
      const Password = new PasswordHelper(6)

      const _password = Faker.internet.password(8)
      const passwordHash = await Password.create(_password)

      const MOCK_USER = {
        username: Faker.internet.userName('Test'),
        password: passwordHash,
      }

      const { dataValues: result } = await postgresContext.create(MOCK_USER)
      _user = { ...result, password: _password }
    })

    const _route = {
      method: 'POST',
      url: '/login',
    }

    it('Must return token', async () => {
      const response = await App.inject({
        ..._route,
        payload: {
          username: _user.username,
          password: _user.password,
        },
      })

      equal(response.statusCode, 200)
    })
  })

  describe('POST /singup', function () {
    const _route = {
      method: 'POST',
      url: '/signup',
    }

    const MOCK_USER = {
      username: Faker.internet.userName(),
      password: Faker.internet.password(8),
    }

    it('Can create a new user', async () => {
      const response = await App.inject({
        ..._route,
        payload: MOCK_USER,
      })

      equal(response.statusCode, 200)
    })

    it('Must return that username is already taken', async () => {
      const response = await App.inject({
        ..._route,
        payload: MOCK_USER,
      })

      const { message } = JSON.parse(response.payload)

      equal(message, 'Username already taken')
    })
  })
})
