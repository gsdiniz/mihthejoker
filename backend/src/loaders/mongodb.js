const config = require('../config')
const LOG = require('./winston')
const mongoose = require('mongoose')
const schemas = require('../db')


module.exports.disconnect = async (cb) => {
  return mongoose.connection.close(function () {
    LOG.registerInfo('Mongoose! Desconectado pelo término da aplicação')
    if (cb) {
      cb()
    }
  })
}

module.exports.connect = async () => {
  const uri = `${config.mongodb.schema}://${config.mongodb.user}:${config.mongodb.pass}@${config.mongodb.port ? config.mongodb.host + ':' + config.mongodb.port : config.mongodb.host}`
  mongoose.connection.on('connected', function () {
    LOG.registerInfo('Mongoose! Conectado')
  })

  mongoose.connection.on('disconnected', function () {
    LOG.registerWarn('Mongoose! Desconectado')
  })

  mongoose.connection.on('error', function (erro) {
    LOG.registerError('Mongoose! Erro na conexão ' + erro.message)
  })

  mongoose.set('debug', !config.isProduction)
  mongoose.set('autoIndex', !config.isProduction)

  const conn = await mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.mongodb.name
    }
  ).catch(err => {
    LOG.registerError(err)
    return true
  })

  schemas.forEach(entry => {
    const [name, schema] = entry
    LOG.registerInfo(`Mongoose => carregando model: ${name}`)
    mongoose.model(name, schema)
  })

  return conn
}
