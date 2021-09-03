class NotFound extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFound'
    this.code = 404
  }
}

module.exports = () => NotFound
