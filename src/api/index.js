const Hapi = require('@hapi/hapi')
const { Routes: HeroesRoutes, mapRoutes } = require('./routes/heroes')
const Strategy = require('../db/base/strategy')
const MongoDB = require('../db/mongodb')
const model = require('../db/mongodb/model/heroes')
const Postgres = require('../db/postgres')

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
    user: 'user',
    pass: 'pass',
    db: 'heroes',
  })
  const mongoContext = new Strategy(new MongoDB(mongoConnection, model))

  await app.register([
    Inert,
    Vision,
    { plugin: Swagger, options: swaggerConfig },
  ])

  app.route(
    mapRoutes(new HeroesRoutes(mongoContext), HeroesRoutes.methodExtractor())
  )

  await app.start().then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Api running on port ${app.info.port}`)
    }
  })

  return app
}

module.exports = api
