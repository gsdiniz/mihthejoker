import API from './API'

class User extends API {
  constructor() {
    super('/user');
  }

  async forgetPassword (email) {
    return fetch(`${this.baseUrl}/lost-password`, {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({email})
    }).then(this._handleResponse)
  }
  
  async resetPassword ({password, passwordCheck: password_check}, token) {
    return fetch(`${this.baseUrl}/reset-password?token=${token}`, {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({password, password_check})
    }).then(resp => {
      return resp.text().then(text => {
        if (!resp.ok) {
            const data = text && JSON.parse(text)
            const error = new Error((data && data.message) || resp.statusText)
            error.errors = data.errors || null
            error.code = resp.status
            throw error
        }
        return true;
      })
    })
  }

  async getOne (idUser) {
    if (await this.refreshToken()) {
      return fetch(`${this.baseUrl}/${idUser}`, {
        headers: this._handleAuthHeaders({})
      }).then(this._handleResponse)
    }

    const err = new Error('Usuário não autenticado, faça login novamente')
    err.code = 401
    throw err
  }
}

export default User
