class ServiceUnavailable extends Error {
  constructor(message) {
    super(message)
    this.name = 'ServiceUnavailable'
    this.code = 503
  }
}

module.exports = () => ServiceUnavailable
