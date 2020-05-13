const Route = require('./route')
const { join } = require('path')

class Coverage extends Route {
  redirect() {
    return {
      method: 'GET',
      path: '/coverage',
      config: { auth: false },
      handler: (request, h) => {
        return h.redirect('/coverage/')
      },
    }
  }
  serve() {
    return {
      method: 'GET',
      path: '/coverage/{param*}',
      config: {
        auth: false,
      },
      handler: {
        directory: {
          path: join(__dirname, '..', '..', '..', 'coverage'),
          redirectToSlash: true,
          listing: true,
        },
      },
    }
  }
}

module.exports = Coverage
