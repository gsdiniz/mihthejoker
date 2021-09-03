module.exports = (expressApp) => ({
  model: require('./ExercicioModel')(expressApp),
  repository: require('./ExercicioRepository')(expressApp),
  service: require('./ExercicioService')(expressApp),
  resource: require('./ExercicioResource')(expressApp),
})