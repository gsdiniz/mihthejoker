const config = require('./config')
const LOG = require('./loaders/winston')
const mongoDB = require('./loaders/mongodb')
const express = require('express')

const processSig = (signal, server) => {
  LOG.registerWarn(`\n${signal} signal received: closing HTTP server`)
  mongoDB.disconnect(() => server.close(() => {
    LOG.registerWarn('HTTP server closed')
    process.exit(0)
  }))
}

const startServer = async () => {
  const app = express()

  await require('./loaders')({ expressApp: app })
    .catch(e => LOG.registerError(e))

  const server = app.listen(config.port, function () {
    LOG.registerInfo(`################################################
          Server listening on port: ${config.port}
          Process Id (PID): ${process.pid}\n
        ################################################`)
  })

  process.on('SIGTERM', () => processSig('SIGTERM', server))
  process.on('SIGINT', () => processSig('SIGINT', server))
}

startServer()
