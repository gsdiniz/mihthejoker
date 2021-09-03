const UserRoute = require('./UserRoute')
const LoginRoute = require('./LoginRoute')

module.exports = (expressApp) => {
  return {
    user: UserRoute(expressApp),
    login: LoginRoute(expressApp)
  }
}
