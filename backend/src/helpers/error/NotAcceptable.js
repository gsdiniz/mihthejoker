class NotAcceptable extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotAcceptable'
    this.code = 400
  }
}

module.exports = () => NotAcceptable
