
module.exports = (expressApp) => {
  class ExercicioCategoriaService {
    constructor (repository) {
      this.repository = repository
    }

    async getAll () {
      const list = await this.repository.find({})
      console.log(list)
      return list
    }

    async create (registro) {
      this._verifyNome(registro.nome)
      const reg = await this.repository.create(registro)
      return reg
    }

    async update (idReg, registro) {
      this._verifyNome(registro.nome)

      if (idReg !== registro._id) {
        throw new expressApp.helpers.error.NotAcceptable('Não é possível alterar dados de outro registro');
      }

      const reg = await this.repository.update(registro._id, registro)
      return reg
    }

    async remove (registro) {
      await this.repository.remove(registro)
      return true
    }

    async count () { return this.repository.count() }

    async _verifyNome (nome) {
      const categoria = await this.repository.findByNome(nome)
      if (categoria) {
        throw new expressApp.helpers.error.NotAcceptable(`Categoria de exercício já cadastrada => ${nome}`)
      }
    }
  }
  
  return ExercicioCategoriaService
}
