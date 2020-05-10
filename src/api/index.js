const Hapi = require('@hapi/hapi')
const { Auth, Heroes, mapRoutes } = require('./routes')
const Strategy = require('../db/base/strategy')
const MongoDB = require('../db/mongodb')
const heroesModel = require('../db/mongodb/model/heroes')
const Postgres = require('../db/postgres')
const usersModel = require('../db/postgres/model/users')

const Swagger = require('hapi-swagger')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')

const swaggerConfig = {
  info: {
    title: 'Heroes API',
    version: 'v1.0',
  },
}

const app = new Hapi.Server({
  port: 5000,
})

const api = async () => {
  const mongoConnection = MongoDB.connect({
    db: 'heroes',
  })
  const mongoContext = new Strategy(new MongoDB(mongoConnection, heroesModel))

  const postgresConnection = Postgres.connect({
    db: 'users',
  })
  const postgresContext = new Strategy(
    new Postgres(postgresConnection, usersModel)
  )

  await app.register([
    Inert,
    Vision,
    { plugin: Swagger, options: swaggerConfig },
  ])

  app.route([
    ...mapRoutes(new Heroes(mongoContext), Heroes.methodExtractor()),
    ...mapRoutes(new Auth(postgresContext), Auth.methodExtractor()),
  ])

  await app.start().then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Api running on port ${app.info.port}`)
    }
  })

  return app
}

module.exports = api
