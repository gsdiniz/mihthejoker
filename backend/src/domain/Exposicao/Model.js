
module.exports = (expressApp) => class Exposicao {
  constructor() {
    this.nome = ''
    this.localidade = ''
    this.videoURL = ''
    this.expositor = {}
    this.created_at = Date.now()
    this.updated_at = Date.now()
  }
}
