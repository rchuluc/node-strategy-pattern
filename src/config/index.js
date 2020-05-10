const { join } = require('path')
const env = require('dotenv').config({
  path: join(__dirname, `.env.${process.env.NODE_ENV || 'dev'}`),
})

module.exports = env
