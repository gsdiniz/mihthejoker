const ResetPasswordTokenRepository = require('./ResetPasswordTokenRepository')

module.exports = (expressApp) => ({
  model: require('./UserModel')(expressApp),
  repository: require('./UserRepository')(expressApp),
  service: require('./UserService')(expressApp, new ResetPasswordTokenRepository(expressApp.mongoDB.model('ResetPasswordToken'))),
  resource: require('./UserResource')(expressApp),
})
