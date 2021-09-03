import API from '../API';
import Categoria from './Categoria'
import GrupoMuscular from './GrupoMuscular'

export { Categoria, GrupoMuscular };

class Exercicio extends API {
  constructor() {
    super('/exercicio');
  }

  _buildFormData (registro) {
    let formData = new FormData()

    if (registro.gif) {
      formData.append('gif', registro.gif[0])
    }
    formData.append('nome', registro.nome)
    formData.append('categoria', registro.categoria)

    registro.grupoMuscular.forEach(grupo => {
      formData.append('grupoMuscular[]', grupo)
    })

    return formData
  }

  async post (registro) {
    const formData = this._buildFormData(registro)
    return fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this._accessToken}`
      },
      body: formData
    }).then(this._handleResponse)
  }

  async put (registro) {
    const formData = this._buildFormData(registro)
    return fetch(`${this.baseUrl}/${registro._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this._accessToken}`
      },
      body: formData
    }).then(this._handleResponse)
  }
}

export default Exercicio
