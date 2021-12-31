const ResetPasswordTokenModel = require('./ResetPasswordTokenModel')

class ResetPasswordTokenRepository {
  constructor(mongooseModel) {
    this._mongoose = mongooseModel
  }

  async create(token, user, expires_at) {
    const mongoose = await this._mongoose.create({ token, user, expires_at })
    return Object.assign(new ResetPasswordTokenModel(), mongoose.toJSON())
  }

  async findByToken(token) {
    const mongoose = await this._mongoose.findOne({token})
    return mongoose ? Object.assign(new ResetPasswordTokenModel(), mongoose.toJSON()) : null
  }

  async findByUser(id) {
    const mongoose = await this._mongoose.findOne({ user: id })
    return mongoose ? Object.assign(new ResetPasswordTokenModel(), mongoose.toJSON()) : null
  }

  deleteByToken(hashToken) {
    return this._mongoose.findOneAndDelete({ token: hashToken })
  }

  deleteByUser(user) {
    return this._mongoose.deleteMany({ user })
  }
}

module.exports = ResetPasswordTokenRepository
