const morganLoader = require('./morgan')
const expressLoader = require('./express')
const apiLoader = require('./api')
const { connect: mongoDB } = require('./mongodb')
const LOG = require('./winston')
const config = require('../config')

module.exports = async ({ expressApp }) => {
  expressApp.appConfig = config

  await morganLoader(expressApp)
  expressApp.logger = {
    registerError: LOG.registerError,
    registerInfo: LOG.registerInfo,
    registerDebug: LOG.registerDebug,
    registerWarn: LOG.registerWarn
  }
  LOG.registerInfo('Morgan carregado')

  await mongoDB().then((retorno) => {
    if (retorno === false) {
      LOG.registerError('MongoDB não carregado')
      return
    }
    expressApp.mongoDB = retorno
    LOG.registerInfo('MongoDB carregado')
  })

  await expressLoader(expressApp)
  LOG.registerInfo('Express carregado')

  await apiLoader(expressApp)
  LOG.registerInfo('API carregada')
}
