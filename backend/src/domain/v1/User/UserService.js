const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

module.exports = (expressApp, ResetPasswordTokenRepository) => {
  class UserService {

    constructor (repository, jwtSecret) {
      this.repository = repository
      this.resetTokenRepository = ResetPasswordTokenRepository
      this.jwtSecret = jwtSecret
      this.mailService = expressApp.helpers.emails
      this.getQueryDefaultParams = { limit: 10, lean: true, skip: 0 }
    }

    generatePassword (password) {
      return this.repository.constructor.generatePassword(password)
    }
  
    async getAll (reqQuery) {
      const query = {...this.getQueryDefaultParams}
      for (const prop in reqQuery) {
        if (getQueryDefaultParams.hasOwnProperty(prop)) {
          query[prop] = parseInt(reqQuery[prop])
        }
      }
  
      const listUsers = await this.repository.find(
        {},
        'displayName email phoneNumber disabled photoURL id',
        query
        )
  
      return listUsers.map(user => {
        delete user.password
        return user
      })
    }

    removeResetPasswordToken (token) {
      return this.resetTokenRepository.deleteByToken(token)
    }
    
    async verifyResetPasswordToken (token) {
      let isTokenOk = false

      const savedToken = await this.resetTokenRepository.findByToken(token)

      if (savedToken && savedToken.expires_at.getTime() > Date.now()) {
        isTokenOk = savedToken
      }

      return isTokenOk
    }

    passwordResetMatch (password, confirm_password) {
      return password.localeCompare(confirm_password) == 0
    }

    async sendMailRecoverPassword (email) {
      try {
        const user = await this.getByEmail(email)
        expressApp.logger.registerInfo(user)
        if (user) {
          const token = hashToken(crypto.randomBytes(24).toString('hex'))
          const expires_at = new Date(Date.now() + (5 * 60 * 1000))
          await this.resetTokenRepository.deleteByUser(user._id)
          await this.resetTokenRepository.create(token, user._id, expires_at)
          this.mailService.sendResetPassword(`/v1/user/reset-password/`, user.email, token)
        }

        return user
      } catch (err) {
        throw err
      }
    }
  
    async verifyEmail (token) {
      try {
        const payload = jwt.verify(token, this.jwtSecret)
        const usuario = await this.repository.findByEmail(payload.email)
  
        if (!usuario || usuario.emailVerified) {
          throw new expressApp.helpers.error.BadRequest('Token inválido')
        }
  
        await this.repository.findByIdAndUpdate(usuario._id, { emailVerified: true})
        return true
      } catch (err) {
        if (err instanceof expressApp.helpers.error.BadRequest) {
          throw err
        }
        expressApp.logger.registerError(err)
        throw new expressApp.helpers.error.BadRequest('Token inválido')
      }
    }

    async getByEmail (email) { return this.repository.findByEmail(email, '-password') }
  
    async getById (__id) { return this.repository.findById(__id, '-password') }
  
    async updateOne (__id, body) {
      if (__id != body._id) {
        throw new expressApp.helpers.error.BadRequest('Não é possível alterar de dados outro usuário')
      }
  
      body.updated_at = Date.now()
      delete body._id
      return this.repository.findByIdAndUpdate(__id, body)
    }
  
    async deleteOne (__id) { return this.repository.findByIdAndDelete(__id) }
  
    async countUsers () { return this.repository.count() }
  }

  return UserService
}
