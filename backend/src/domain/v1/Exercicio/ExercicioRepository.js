const ExercicioModel = require ('./ExercicioModel')()

module.exports = (expressApp) => {
  class ExercicioRepository {
    constructor(mongooseModel) {
      this._mongoose = mongooseModel
    }

    async count() {
      return this._mongoose.count()
    }
  
    async find (params, fieldsToReturn = null, queryOptions = null) {
      const lista = await this._mongoose.find(params,fieldsToReturn, queryOptions)
        .populate('categoria')
        .populate('grupoMuscular')
      return lista.map(model => {
        return Object.assign(new ExercicioModel(), model.toJSON())
      })
    }

    async findByNome (nome) {
      const mongoose = await this._mongoose.findOne({nome})
        .populate('categoria')
        .populate('grupoMuscular')
      return mongoose ? Object.assign(new ExercicioModel(), mongoose.toJSON()) : null
    }

    async findById (id) {
      const mongoose = await this._mongoose.findById(id)
        .populate('categoria')
        .populate('grupoMuscular')
      return mongoose ? Object.assign(new ExercicioModel(), mongoose.toJSON()) : null
    }

    async create(registro) {
      const mongoose = await this._mongoose.create(registro)
      return Object.assign(new ExercicioModel(), mongoose.toJSON())
    }

    async update(id, registro) {
      delete registro._id
      const mongoose = await this._mongoose.findByIdAndUpdate(id, registro, 
        { new: true,
          runValidators: true
        })
        .populate('categoria')
        .populate('grupoMuscular')
      return Object.assign(new ExercicioModel(), mongoose.toJSON())
    }

    async remove(id) {
      await this._mongoose.findByIdAndDelete(id)
      return true
    }
  }
  
  return ExercicioRepository
}
