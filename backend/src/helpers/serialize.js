const jsontoxml = require('jsontoxml')

const json = (dados) => {
  return JSON.stringify(dados)
}

module.exports = (autoLoader) => (contentType, data) => {
  // const dados = filtrar(data)
  const dados = data

  if (contentType === 'application/json') {
    return json(dados)
  }

}
