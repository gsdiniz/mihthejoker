const bcrypt = require('bcrypt')
const LoginModel = require('./LoginModel')()
const passwordRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~])[a-zA-Z0-9!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~]{8,}$/

module.exports = (expressApp) => {
  class LoginRepository {
    constructor(mongooseModel) {
      this._mongoose = mongooseModel
    }
  
    static createUser (params) {
      const model       = new LoginModel()
      model.email       = params.email || ''
      model.password    = params.password || ''
      model.displayName = params.displayName || ''
      return model
    }
  
    static generatePassword (password) {
      if (password.match(passwordRegex) == null) {
        const err = new Error('Informe uma senha segura, pelo menos 1 letra maiúscula, 1 minúscula, 1 número, 1 carácter especial e no mínimo 8 caractéres de comprimento')
        err.code = 406
        throw err
      }
      return bcrypt.hash(password, expressApp.appConfig.hashCost)
    }
  
    async create(user) {
      const mongoose = await this._mongoose.create(user)
      return Object.assign(new LoginModel(), mongoose.toJSON())
    }
  
    async findByEmail(email) {
      const mongoose = await this._mongoose.findOne({email})
      return mongoose ? Object.assign(new LoginModel(), mongoose.toJSON()) : null
    }
  
    async findById(id) {
      const mongoose = await this._mongoose.findById(id)
      return mongoose ? Object.assign(new LoginModel(), mongoose.toJSON()) : null
    }
  
    async findByIdAndUpdate(id, props) {
      const mongoose = await this._mongoose.findByIdAndUpdate(
        id,
        props,
        { new: true,
          runValidators: true,
        })
      return Object.assign(new LoginModel(), mongoose.toJSON())
    }
  }

  return LoginRepository
}
