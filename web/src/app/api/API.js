import config from '../config'

class API {
  constructor (url = '') {
    this._accessToken = null
    this._refreshToken = null
    this._loadTokens()
    this._baseUrl = config.baseUrl
    this._endpoint = url
  }


  get baseUrl () {
    return this._baseUrl + this._endpoint
  }

  _loadTokens() {
    const access = localStorage.getItem('accessToken')
    const refresh = localStorage.getItem('refreshToken')
    this._accessToken = access ? access : null
    this._refreshToken = refresh ? refresh : null
  }

  _handleAuthHeaders = (headers = {}) => {
    return Object.assign({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._accessToken}`
    }, {...headers})
  }

  async _handleResponse (resp) {
    return resp.text().then(text => {
      if (!resp.ok) {
          const data = text && JSON.parse(text)
          const error = new Error((data && data.message) || resp.statusText)
          if (data.errors) {
            let message = ''
            data.errors.forEach((erro, key) => {
              message += `${key + 1} - ${erro.msg}`
            })
            error.message = message
          }

          if (data.error) {
            let entries = Object.entries(data.error)
            error.message = `${entries[0][1]} ${entries.length-1 > 0 ? '+' + entries.length-1 + ' erro(s) ' : ''}`
          }
          error.code = resp.status
          throw error
      }
      return text && JSON.parse(text);
    });
  }

  async refreshToken () {
    try {
      this._loadTokens()
      const payload = (this._accessToken) ? JSON.parse(atob(this._accessToken.split('.')[1])) : { exp: 0 }
      if (payload.exp * 1000 < Date.now()) {

        if (!this._refreshToken) {
          const err = new Error()
          err.code = 401
          throw err
        }

        const tokens = await fetch(`${this._baseUrl}/login/refresh-token/${this._refreshToken}`).then(this._handleResponse)
        localStorage.setItem('accessToken', tokens.accessToken)
        localStorage.setItem('refreshToken', tokens.refreshToken)
        this._loadTokens()
      }
      return true
    } catch (err) {
      if ([401, 403].indexOf(err.code) === -1) {
        throw err;
      }
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return false
    }
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

export default API
