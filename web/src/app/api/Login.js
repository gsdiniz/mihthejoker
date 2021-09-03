import API from './API'

const Login = class extends API {
  constructor() {
    super('');
  }

  login (email, senha) {
    return fetch(`${this.baseUrl}/login`, {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({email, senha})
    }).then(this._handleResponse)
  }

  register (formRegister) {
    return fetch(`${this.baseUrl}/login/register`, {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(formRegister)
    }).then(this._handleResponse)
  }
  
  logout () {
    return fetch(`${this.baseUrl}/logout`, {
      headers: this._handleAuthHeaders(),
      method: 'POST',
      body: JSON.stringify({refreshToken: this._refreshToken})
    }).then(resp => resp.status)
  }
}

export default Login
