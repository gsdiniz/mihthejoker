
module.exports = (expressApp) => {
  class ExercicioService {
    constructor (repository) {
      this.repository = repository
    }

    async getAll () {
      const list = await this.repository.find({})
      return list
    }

    async create (registro) {
      await this._verifyNome(registro.nome)
      const reg = await this.repository.create(registro)
      return reg
    }

    async update (idReg, registro) {
      await this._verifyNome(registro.nome, idReg)
      console.log(registro)
      const reg = await this.repository.update(idReg, registro)
      return reg
    }

    async remove (registro) {
      await this.repository.remove(registro)
      return true
    }

    async count () { return this.repository.count() }

    async _verifyNome (nome, id) {
      const categoria = await this.repository.findByNome(nome)
      if (categoria && id != categoria._id) {
        throw new expressApp.helpers.error.NotAcceptable(`Exercício já cadastrado => ${nome}`)
      }
    }
  }
  
  return ExercicioService
}
