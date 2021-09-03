const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const tokenTypes = ['refreshToken', 'accessToken']
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')

module.exports = (expressApp) => {
  class LoginService {
    constructor (userRepository, allowListRepository, blockListRepository) {
      this.userRepository = userRepository
      this.allowListRepository = allowListRepository
      this.blockListRepository = blockListRepository
      this.jwtSecret = expressApp.appConfig.jwtSecret
      this.mailService = expressApp.helpers.emails
    }
  
    async accessTokenHashFromDB (token) {
      return this.blockListRepository.findByToken(hashToken(token))
    }
  
    async refreshTokenHashFromDB (token) {
      return this.allowListRepository.findByToken(hashToken(token))
    }
  
    async _recoverHashedToken(tokenType, token) {
      let err = null
      if (tokenTypes.indexOf(tokenType) == -1) {
        throw new expressApp.helpers.error.Forbidden('Token type incorrect')
      }
  
      const funcVerify = `${tokenType}HashFromDB`
      return this[funcVerify] (token)
    }
  
    async blockAccessToken (token = '0') {
      const accessToken = await this._recoverHashedToken('accessToken', token)
  
      if (accessToken && accessToken.expires_at.getTime() < (new Date()).getTime()) {
        return this.blockListRepository.delete(accessToken.token)
      }
  
      return this.blockListRepository.create({ token: hashToken(token), expires_at: jwt.decode(token).exp * 1000 })
    }
  
    async verfiyRefreshToken (token = '0') {
      const refreshToken = await this._recoverHashedToken('refreshToken', token)
  
      if (!refreshToken || refreshToken.expires_at.getTime() < (new Date()).getTime()) {
        const toDelete = refreshToken ? refreshToken.token : hashToken(token)
        await this.allowListRepository.delete(toDelete)
        throw new expressApp.helpers.error.Forbidden('Invalid Token')
      }
  
      const logged = await this.userRepository.findById(refreshToken.user)
      await this.allowListRepository.delete(refreshToken.token)
      return logged
    }
  
    async buildUsuario (dados) {
      const newUser = this.userRepository.constructor.createUser(dados)
      newUser.password = await this.userRepository.constructor.generatePassword(newUser.password)
      return newUser
    }
  
    async createUser (user) {
      const emailCadastrado = await this.userRepository.findByEmail(user.email)
  
      if (emailCadastrado) {
        throw new expressApp.helpers.error.NotAcceptable(`Usuário já cadastrado com esse email`)
      }
  
      const newUser = await this.userRepository.create(user)
      this.mailService.sendVerifyEmail(`/v1/user/verifyEmail/`, newUser.email, jwt.sign({email: newUser.email}, this.jwtSecret))
      delete newUser.password
      return newUser
    }
  
    async criaTokens (payload) {
      const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
      const refreshToken = crypto.randomBytes(24).toString('hex')
      const hashedToken = hashToken(refreshToken)
      const user = payload.id
      const expires_at = new Date(Date.now() + (5 * 60 * 60 * 24 * 1000))
      await this.allowListRepository.create({ token: hashedToken, user, expires_at })
      return [accessToken, refreshToken]
    }
  
    async getOne (__id) {
      const user = this.userRepository.findById(__id)
      delete user.password
      return user
    }
  
    async updateOne (__id, body) {
      if (__id != body._id) {
        throw new expressApp.helpers.error.BadRequest('Não é possível alterar de dados outro usuário')
      }
  
      body.updated_at = Date.now()
      const userUpdated = this.userRepository.findByIdAndUpdate(
        __id,
        {...body})
      delete userUpdated.password
      return userUpdated
    }
  }

  return LoginService
}
