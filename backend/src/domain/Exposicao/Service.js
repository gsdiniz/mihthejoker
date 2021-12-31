
module.exports = (expressApp) => {
  class ExposicaoService {
    constructor (repository) {
      this.repository = repository
    }

    async exposicoesParaVisitacao (queryParams) {
      const list = await this.repository.find({}, null, queryParams)
      return list
    }

    async getAll (params = {}, fieldsToReturn = {}, queryParams) {
      const list = await this.repository.find(params, fieldsToReturn, queryParams)
      return list
    }

    async create (registro) {
      await this._verifyNome(registro.nome)
      const reg = await this.repository.create(registro)
      return reg
    }

    async update (idReg, registro) {
      await this._verifyNome(registro.nome, idReg)
      const reg = await this.repository.update(idReg, registro)
      return reg
    }

    async remove (registro) {
      await this.repository.remove(registro)
      return true
    }

    async count (filter = {}) { return this.repository.count(filter) }

    async _verifyNome (nome, id) {
      const categoria = await this.repository.findByNome(nome)
      if (categoria && id != categoria._id) {
        throw new expressApp.helpers.error.NotAcceptable(`Exposição já cadastrada => ${nome}`)
      }
    }
  }
  
  return ExposicaoService
}
