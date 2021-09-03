class Forbidden extends Error {
  constructor(message = 'You shall not pass') {
    super(message)
    this.name = 'Forbidden'
    this.code = 403
  }
}

module.exports = () => Forbidden
