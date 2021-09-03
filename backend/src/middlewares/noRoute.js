module.exports = (autoLoader) => {
  return (req, res, next) => {
    const err = new Error('Requisição inválida')
    // const err = {}
    err.code = 400
    // err.message = 'Requisição inválida'
    next(err)
  }
}
