const UserRoute = require('./UserRoute')
const LoginRoute = require('./LoginRoute')
const Exposicao = require('./Exposicao')

module.exports = (expressApp) => {
  return {
    user: UserRoute(expressApp),
    login: LoginRoute(expressApp),
    exposicao: Exposicao(expressApp)
  }
}
