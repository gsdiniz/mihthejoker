const dotenv = require('dotenv')
const path = require('path')

const config = dotenv.config({ path: path.join(__dirname, '../../.env') })

// if (config.error) {
//   throw new Error('Arquivo .env não encontrado')
// }

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const originsWhitelist = process.env.CORS.split(',')

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  host: process.env.HOST || 'http://app.localhost:8095',
  port: parseInt(process.env.PORT, 10),
  uploadPath: process.env.UPLOAD_PATH || '/opt/app/uploads',
  uploadView: process.env.UPLOAD_VIEW || 'http://localhost:3000',
  hashCost: process.env.HASH_COST || 12,
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,
  mail: {
    host: process.env.MAIL_HOST,
    from: process.env.MAIL_FROM,
    port: process.env.MAIL_PORT || 587,
    auth: process.env.MAIL_AUTH || false,
    secure: process.env.MAIL_SECURE || false,
    tls: {
      rejectUnauthorized: false
    }
  },
  mongodb: {
    schema: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly'
  },
  contentType: ['application/json', 'application/xml'],
  cors: {
    origin: function (origin, callback) {
      if (originsWhitelist[0] === '*' || originsWhitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: 'GET,OPTIONS,HEAD,PUT,POST,DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 204
  }
}
