const LOG = require('./winston')

module.exports = async (expressApp) => {
  expressApp.middlewares.passport.strategiesForAuth(
    expressApp.mongoDB.model('User'),
    expressApp.mongoDB.model('BlockList')
  )

  expressApp.use(expressApp.middlewares.contentType)

  const apiRoutes = require('../api/v1/')(expressApp)

  for (const resource in apiRoutes) {
    LOG.registerInfo(`Carregando a rota ${resource}`)
    expressApp.use('/v1', apiRoutes[resource])
  }

  expressApp.use(expressApp.middlewares.noRoute)

  expressApp.use((err, req, res, next) => {
    if (!(err instanceof Error)) {
      err = new Error('Erro inesperado')
      err.code = 500
    }

    if (typeof err.code === 'undefined') {
      err.code = 500
    }

    LOG.registerError(err)

    res
      .status(err.code)
      .send(expressApp.helpers.serialize(res.getHeader('Content-Type'), { code: err.code, message: err.message }))
  })

  return expressApp
}
