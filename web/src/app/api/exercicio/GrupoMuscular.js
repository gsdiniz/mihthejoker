import API from '../API'

class GrupoMuscular extends API {
  constructor() {
    super('/exercicio-grupo-muscular');
  }

  async getAll () {
    return fetch(`${this.baseUrl}`, {
      headers: this._handleAuthHeaders({})
    }).then(this._handleResponse)
  }

  async post (registro) {
    return fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: this._handleAuthHeaders({}),
      body: JSON.stringify(registro)
    }).then(this._handleResponse)
  }

  async put (registro) {
    return fetch(`${this.baseUrl}/${registro._id}`, {
      method: 'PUT',
      headers: this._handleAuthHeaders({}),
      body: JSON.stringify(registro)
    }).then(this._handleResponse)
  }

  async delete (registro) {
    return fetch(`${this.baseUrl}/${registro._id}`, {
      method: 'DELETE',
      headers: this._handleAuthHeaders({}),
      body: JSON.stringify(registro)
    }).then(this._handleResponse)
  }
}

export default GrupoMuscular
