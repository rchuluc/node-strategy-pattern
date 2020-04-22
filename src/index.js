const Strategy = require('./db/base/strategy')
const MongoDB = require('./db/mongoDB')
const Postgres = require('./db/postgres')

const MongoDBContext = new Strategy(new MongoDB())
const PostgresContext = new Strategy(new Postgres())

MongoDBContext.create()
PostgresContext.delete({ name: 'Iron man' })

// Should throw a error
// MongoDBContext.delete()
