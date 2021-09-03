module.exports = (expressApp) => ({
  model: require('./ExercicioCategoriaModel')(expressApp),
  repository: require('./ExercicioCategoriaRepository')(expressApp),
  service: require('./ExercicioCategoriaService')(expressApp),
  resource: require('./ExercicioCategoriaResource')(expressApp),
})