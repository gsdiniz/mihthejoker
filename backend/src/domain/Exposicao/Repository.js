const Exposicao = require ('./Model')()

module.exports = (expressApp) => {
  class ExposicaoRepository {
    constructor(mongooseModel) {
      this._mongoose = mongooseModel
    }

    async count(filter = {}) {
      return this._mongoose.count(filter)
    }

    async find (params = {}, fieldsToReturn = null, queryOptions = null) {
      const lista = await this._mongoose.find(params, fieldsToReturn, queryOptions)
        .populate('expositor', '_id displayName email').exec()
      return lista.map(model => {
        return Object.assign(new Exposicao(), model.toJSON())
      })
    }

    async findByNome (nome) {
      const mongoose = await this._mongoose.findOne({nome})
        .populate('expositor', '_id displayName email').exec()
      return mongoose ? Object.assign(new Exposicao(), mongoose.toJSON()) : null
    }

    async findById (id) {
      const mongoose = await this._mongoose.findById(id)
        .populate('expositor', '_id displayName email').exec()
      return mongoose ? Object.assign(new Exposicao(), mongoose.toJSON()) : null
    }

    async create(registro) {
      const mongoose = await this._mongoose.create(registro)
      return Object.assign(new Exposicao(), mongoose.toJSON())
    }

    async update(id, registro) {
      delete registro._id
      const mongoose = await this._mongoose.findByIdAndUpdate(id, registro, 
        { new: true,
          runValidators: true
        })
        .populate('expositor')
      return Object.assign(new Exposicao(), mongoose.toJSON())
    }

    async remove(id) {
      await this._mongoose.findByIdAndDelete(id)
      return true
    }
  }

  return ExposicaoRepository
}
