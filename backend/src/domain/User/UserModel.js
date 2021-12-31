module.exports = () => class UserModel {
  constructor () {
    this.email = null
    this.password = null
    this.disabled = null
    this.emailVerified = null
    this.displayName = null
    this.metadata = {
      phoneNumber: null,
      photoURL: null,
      uf: null,
      cidade: null,
      bairro: null,
      cpf: null,
      cref: null,
      sobre: null
    }
    this.role = null
    this.created_at = null
    this.updated_at = null
  }
}
