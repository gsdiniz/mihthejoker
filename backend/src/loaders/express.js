const config = require('../config')
const path = require('path')
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
  // app.use(express.static(path.join(__dirname, '../public')))
  // expressApp.set('view engine', 'ejs')
  // expressApp.set('views', path.join(__dirname, '../views'))
  expressApp.use(bodyParser.urlencoded({ extended: true }))
  expressApp.use(bodyParser.json())

  // PARA BROWSERS QUE NÃO ACEITAM METHODS DIFERENTES DOS USUAIS
  expressApp.use(require('method-override')())

  // CORS
  expressApp.use(cors(config.cors))

  // Load-Automático
  consign({ cwd: path.join(__dirname, '../.'), verbose: !config.isProduction })
    .include('helpers')
    .then('jobs')
    .then('middlewares')
    .then('subscribers')
    .then('domain/v1/Login/index.js')
    .then('domain/v1/User/index.js')
    .into(expressApp)

  return expressApp
}
