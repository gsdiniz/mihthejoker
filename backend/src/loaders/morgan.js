const morgan = require('morgan')
const LOG = require('./winston')

module.exports = async (expressApp) => {
  expressApp.use(morgan('combined', {
    stream: LOG.streamInfo,
    skip: function (req, res) { return !(res.statusCode < 400) }
  }))
  expressApp.use(morgan('combined', {
    stream: LOG.streamError,
    skip: function (req, res) { return !(res.statusCode >= 400) }
  }))
}
