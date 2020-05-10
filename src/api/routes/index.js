const Heroes = require('./heroes')
const Auth = require('./auth')

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]())
}

module.exports = { Heroes, Auth, mapRoutes }
