const jsontoxml = require('jsontoxml')

let camposPublicos = []
let tagSingular = 'error'
let tagPlural = 'errors'

const json = (dados) => {
  return JSON.stringify(dados)
}

const xml = (dados) => {
  let tag = tagSingular

  if (Array.isArray(dados)) {
    tag = tagPlural
    dados = dados.map((item) => {
      return {
        [tagSingular]: item
      }
    })
  }

  return jsontoxml({ [tag]: dados })
}

const filtrarObjeto = (dados) => {
  const novoObjeto = {}

  camposPublicos.forEach((campo) => {
    if (dados.hasOwnProperty(campo)) {
      novoObjeto[campo] = dados[campo]
    }
  })

  return novoObjeto
}

const filtrar = (dados) => {
  if (Array.isArray(dados)) {
    dados = dados.map(item => {
      return filtrarObjeto(item)
    })
  } else {
    dados = filtrarObjeto(dados)
  }

  return dados
}

module.exports = (autoLoader) => (contentType, data) => {
  // const dados = filtrar(data)
  const dados = data

  if (contentType === 'application/json') {
    return json(dados)
  }

  if (contentType === 'application/xml') {
    return xml(dados)
  }
}
