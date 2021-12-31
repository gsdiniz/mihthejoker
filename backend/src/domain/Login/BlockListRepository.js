const BlockListModel = require('./BlockListModel')

class BlockListRepository {
  constructor(mongooseModel) {
    this._mongoose = mongooseModel
  }

  async create(token) {
    const mongoose = await this._mongoose.create(token)
    return Object.assign(new BlockListModel(), mongoose.toJSON())
  }

  async findByToken(token) {
    const mongoose = await this._mongoose.findOne({token})
    return mongoose ? Object.assign(new BlockListModel(), mongoose.toJSON()) : null
  }

  delete(hashToken) {
    return this._mongoose.findOneAndDelete({ token: hashToken })
  }
}

module.exports = BlockListRepository
