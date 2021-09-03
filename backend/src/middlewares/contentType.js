const config = require('../config/index')

module.exports = (autoLoader) => {
  return (req, res, next) => {
    let formatoRequisitado = req.header('Accept')

    if (formatoRequisitado === '*/*' || formatoRequisitado.indexOf('*/*') !== -1) {
      formatoRequisitado = 'application/json'
    }

    if (config.contentType.indexOf(formatoRequisitado) === -1) {
      res.status(406)
      res.end()
      return
    }

    res.setHeader('Content-Type', formatoRequisitado)
    next()
  }
}
