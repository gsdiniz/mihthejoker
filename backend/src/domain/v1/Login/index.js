module.exports = (expressApp) => ({
  model: require('./LoginModel')(expressApp),
  repository: require('./LoginRepository')(expressApp),
  service: require('./LoginService')(expressApp),
  resource: require('./LoginResource')(expressApp),
})