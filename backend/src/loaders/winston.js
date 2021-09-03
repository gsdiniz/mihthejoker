const winston = require('winston')
const config = require('../config')
const path = require('path')

const access = new winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: path.join(__dirname, '../../logs/access.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      format: winston.format.prettyPrint()
    })
  ],
  exitOnError: false,
  level: 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'DD/MM/YYYY HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  )
})

const error = new winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'debug',
      filename: path.join(__dirname, '../../logs/error.log'),
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      format: winston.format.prettyPrint()
    })
  ],
  exitOnError: false,
  level: 'error',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'DD/MM/YYYY HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  )
})

module.exports = {
  registerInfo: (message) => {
    access.info(message)
  },
  registerDebug: (message) => {
    access.debug(message)
  },
  registerWarn: (message) => {
    access.warn(message)
  },
  registerError: (erro) => {
    error.error(erro)
  }
}

module.exports.streamInfo = {
  write: function (message, encoding) {
    access.info(message)
  }
}

module.exports.streamError = {
  write: function (message, encoding) {
    error.error(message)
  }
}
