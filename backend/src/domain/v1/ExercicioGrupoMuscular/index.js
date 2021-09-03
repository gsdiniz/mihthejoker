module.exports = (expressApp) => ({
  model: require('./ExericioGrupoMuscularModel')(expressApp),
  repository: require('./ExericioGrupoMuscularRepository')(expressApp),
  service: require('./ExericioGrupoMuscularService')(expressApp),
  resource: require('./ExericioGrupoMuscularResource')(expressApp),
})