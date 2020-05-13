const Route = require('./route')
const Joi = require('@hapi/joi')
const Boom = require('boom')
const JWT = require('jsonwebtoken')
const PasswordHelper = require('../../utils/passwordHelper')

const failAction = (request, h, err) => {
  const [details] = err.details
  return Boom.badRequest(details.message)
}

class Auth extends Route {
  constructor(db) {
    super()
    this.db = db
  }

  login() {
    return {
      method: 'POST',
      path: '/login',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Login',
        notes: 'Returns JWT token',
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request, h) => {
        const { payload } = request
        const Password = new PasswordHelper(process.env.SALT_ROUNDS)

        try {
          const [user] = await this.db.read({ username: payload.username })

          if (!user) {
            return Boom.notFound('User not found')
          }

          const passwordCheck = await Password.compare(
            payload.password,
            user.password
          )

          if (!passwordCheck) {
            return Boom.unauthorized('Username or password are incorrect')
          }

          const token = JWT.sign(
            {
              username: user.username,
            },
            process.env.JWT_KEY
          )

          return h.response({ username: user.username, token })
        } catch (err) {
          return Boom.badImplementation('Internal Error')
        }
      },
    }
  }

  signIn() {
    return {
      method: 'POST',
      path: '/signup',
      config: {
        auth: false,
        tags: ['api'],
        description: 'Create user',
        notes: 'Create a user to access the API data',
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().min(6).required(),
          }),
        },
      },
      handler: async (request, h) => {
        const { payload } = request
        const Password = new PasswordHelper(process.env.SALT_ROUNDS)

        try {
          const [userExists] = await this.db.read({
            username: payload.username,
          })

          if (userExists) {
            return Boom.badRequest('Username already taken')
          }

          const _password = await Password.create(payload.password)

          const user = await this.db.create({
            username: payload.username,
            password: _password,
          })

          const token = JWT.sign(
            {
              username: user.username,
            },
            process.env.JWT_KEY
          )

          return h.response({ username: user.username, token })
        } catch (err) {
          return Boom.badImplementation('Internal Error')
        }
      },
    }
  }
}

module.exports = Auth
