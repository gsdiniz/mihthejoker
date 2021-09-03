class BadRequest extends Error {
  constructor(message) {
    super(message)
    this.name = 'BadRequest'
    this.code = 400
  }

  static CODE = 400
}

module.exports = () => BadRequest
