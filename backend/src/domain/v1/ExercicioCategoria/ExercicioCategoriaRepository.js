const ExercicioCategoriaModel = require ('./ExercicioCategoriaModel')()

module.exports = (expressApp) => {
  class ExercicioCategoriaRepository {
    constructor(mongooseModel) {
      this._mongoose = mongooseModel
    }

    async count() {
      return this._mongoose.count()
    }
  
    async find (params, fieldsToReturn = null, queryOptions = null) {
      const lista = await this._mongoose.find(params,fieldsToReturn, queryOptions)
      return lista.map(model => {
        return Object.assign(new ExercicioCategoriaModel(), model.toJSON())
      })
    }

    async findByNome (nome) {
      const mongoose = await this._mongoose.findOne({nome})
      return mongoose ? Object.assign(new ExercicioCategoriaModel(), mongoose.toJSON()) : null
    }

    async findById (id) {
      const mongoose = await this._mongoose.findById(id)
      return mongoose ? Object.assign(new ExercicioCategoriaModel(), mongoose.toJSON()) : null
    }

    async create(registro) {
      const mongoose = await this._mongoose.create(registro)
      return Object.assign(new ExercicioCategoriaModel(), mongoose.toJSON())
    }

    async update(id, registro) {
      delete registro._id
      const mongoose = await this._mongoose.findByIdAndUpdate(id, registro, 
        { new: true,
          runValidators: true
        })
      return Object.assign(new ExercicioCategoriaModel(), mongoose.toJSON())
    }

    async remove(id) {
      await this._mongoose.findByIdAndDelete(id)
      return true
    }
  }
  
  return ExercicioCategoriaRepository
}
