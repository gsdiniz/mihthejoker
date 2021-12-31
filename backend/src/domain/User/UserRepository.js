const UserModel = require("./UserModel")()
const bcrypt = require('bcrypt')
const passwordRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~])[a-zA-Z0-9!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~]{8,}$/

module.exports = (expressApp) => {
  class UserRepository {
    constructor(mongooseModel) {
      this._mongoose = mongooseModel
    }

    static generatePassword (password) {
      if (password.match(passwordRegex) == null) {
        const err = new Error('Informe uma senha segura, pelo menos 1 letra maiúscula, 1 minúscula, 1 número, 1 carácter especial e no mínimo 8 caractéres de comprimento')
        err.code = 406
        throw err
      }
      return bcrypt.hash(password, expressApp.appConfig.hashCost)
    }
  
    async count() {
      return this._mongoose.count()
    }
  
    async find (params, fieldsToReturn = null, queryOptions = null) {
      const listaUsers = await this._mongoose.find(params,fieldsToReturn, queryOptions)
      return listaUsers.map(model => {
        return Object.assign(new UserModel(), model)
      })
    }
  
    async findByEmail(email, options = {}) {
      const mongoose = await this._mongoose.findOne({email}, options)
      return mongoose ? Object.assign(new UserModel(), mongoose.toJSON()) : null
    }
  
    async findByCPF(cpf, options = {}) {
      const mongoose = await this._mongoose.findOne({cpf}, options)
      return mongoose ? Object.assign(new UserModel(), mongoose.toJSON()) : null
    }
  
    async findById(id, options = {}) {
      const mongoose = await this._mongoose.findById(id, options)
      return mongoose ? Object.assign(new UserModel(), mongoose.toJSON()) : null
    }
  
    async findByIdAndUpdate(id, props) {
      const mongoose = await this._mongoose.findByIdAndUpdate(
        id,
        props,
        { new: true,
          runValidators: true,
          select: '-password'
        })
      return Object.assign(new UserModel(), mongoose.toJSON())
    }
  
    async findByIdAndDelete (id) {
      return this._mongoose.findByIdAndDelete(id)
    }
  }

  return UserRepository
}
