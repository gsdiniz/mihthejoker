const AllowListModel = require('./AllowListModel')

class AllowListRepository {
  constructor(mongooseModel) {
    this._mongoose = mongooseModel
  }

  async create(token) {
    const mongoose = await this._mongoose.create(token)
    return Object.assign(new AllowListModel(), mongoose.toJSON())
  }

  async findByToken(token) {
    const mongoose = await this._mongoose.findOne({token})
    return mongoose ? Object.assign(new AllowListModel(), mongoose.toJSON()) : null
  }

  async findByUser(id) {
    const mongoose = await this._mongoose.findOne({ user: id })
    return mongoose ? Object.assign(new AllowListModel(), mongoose.toJSON()) : null
  }

  delete(hashToken) {
    return this._mongoose.findOneAndDelete({ token: hashToken })
  }
}

module.exports = AllowListRepository
