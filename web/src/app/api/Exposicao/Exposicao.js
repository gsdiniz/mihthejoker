import API from '../API';

class Exposicao extends API {
  constructor() {
    super('/exposicao');
  }

  async visitar () {
    return fetch(`${this.baseUrl}/visitar`, {
      headers: this._handleAuthHeaders({})
    }).then(this._handleResponse)
  }

  async getAll () {
    return fetch(`${this.baseUrl}`, {
      headers: this._handleAuthHeaders({})
    }).then(this._handleResponse)
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

export default Exposicao
