const config = require('../config')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const consign = require('consign')
const helmet = require('helmet')
const cors = require('cors')

module.exports = async (expressApp) => {
  // expressApp.enable('trust proxy')

  // PROTEAÇÃO
  expressApp.use(helmet())
  expressApp.use(helmet.hidePoweredBy({ setTo: 'PHP 7.1.29' }))

  // MIDDLEWARES
  // expressApp.set('view engine', 'ejs')
  // expressApp.set('views', path.join(__dirname, '../views'))
  expressApp.use(express.urlencoded({ extended: true }))
  expressApp.use(express.json())

  // PARA BROWSERS QUE NÃO ACEITAM METHODS DIFERENTES DOS USUAIS
  expressApp.use(require('method-override')())

  // CORS
  expressApp.use(cors(config.cors))

  if (!config.isProduction) {
    expressApp.use('/uploads', express.static(path.join(__dirname, '../../uploads')))
  }

  // Load-Automático
  consign({ cwd: path.join(__dirname, '../.'), verbose: !config.isProduction })
    .include('helpers')
    .then('middlewares')
    .then('domain/Login/index.js')
    .then('domain/User/index.js')
    .then('domain/Exposicao')
    .into(expressApp)

  return expressApp
}
