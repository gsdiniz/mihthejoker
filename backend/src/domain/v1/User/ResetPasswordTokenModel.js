module.exports = class ResetPasswordTokenModel {
  constructor () {
    this.token = null
    this.user = null
    this.expires_at = null
  }
}
