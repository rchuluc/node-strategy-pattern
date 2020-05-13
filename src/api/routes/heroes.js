const Route = require('./route')
const Joi = require('@hapi/joi')
const Boom = require('boom')

const failAction = (request, h, err) => {
  const [details] = err.details
  return Boom.badRequest(details.message)
}

class Heroes extends Route {
  constructor(db) {
    super()
    this.db = db
  }

  list() {
    return {
      method: 'GET',
      path: '/heroes',
      config: {
        tags: ['api'],
        description: 'List heroes',
        notes: 'Returns heroes from database',
      },
      handler: async (request, h) => {
        try {
          const heroes = await this.db.read()
          return h.response(heroes)
        } catch (err) {
          return Boom.badImplementation('Internal Error')
        }
      },
    }
  }

  create() {
    return {
      method: 'POST',
      path: '/heroes',
      config: {
        tags: ['api'],
        description: 'Insert hero',
        notes: 'Save a hero in database',
        validate: {
          failAction,
          payload: Joi.object({
            name: Joi.string().max(50).required(),
            power: Joi.string().max(50).required(),
          }),
        },
      },
      handler: async (request, h) => {
        const { payload } = request
        try {
          const { _id } = await this.db.create(payload)
          return h
            .response({ message: 'Hero created', payload: { _id } })
            .code(201)
        } catch (err) {
          return Boom.badImplementation('Internal Error')
        }
      },
    }
  }

  update() {
    return {
      method: 'PATCH',
      path: '/heroes/{id}',
      config: {
        tags: ['api'],
        description: 'Update hero',
        notes: 'Update hero information',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required(),
          }),
          payload: Joi.object({
            name: Joi.string().max(50),
            power: Joi.string().max(50),
          }),
        },
      },
      handler: async (request, h) => {
        const { payload, params: id } = request
        const [_id] = Object.values(id)

        try {
          await this.db.update(_id, payload)
          return h.response({ message: 'Hero updated' })
        } catch (err) {
          return Boom.badImplementation('Internal Error')
        }
      },
    }
  }

  delete() {
    return {
      method: 'DELETE',
      path: '/heroes/{id}',
      config: {
        tags: ['api'],
        description: 'Delete hero',
        notes: 'Delete hero from database',
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
        handler: async (request, h) => {
          const { params: id } = request
          const [_id] = Object.values(id)

          try {
            await this.db.delete(_id)
            return h.response({ message: 'Hero deleted' })
          } catch (error) {
            return Boom.badImplementation('Internal Error')
          }
        },
      },
    }
  }
}

module.exports = Heroes
