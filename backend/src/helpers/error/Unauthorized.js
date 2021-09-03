class Unauthorized extends Error {
  constructor(message) {
    super(message)
    this.code = 401
    this.name = 'Unauthorized'
  }
}

module.exports = () => Unauthorized
