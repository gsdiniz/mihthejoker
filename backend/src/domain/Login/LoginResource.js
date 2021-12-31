const { validationResult } = require('express-validator')

module.exports = (expressApp) => {
  class LoginResource {

    constructor(service) {
      this.service = service
    }

    _returnValidationErrors (res, code, errors) {
      return res.status(code).send({ code, errors })
    }
  
    async handleRefreshToken (req, res, next) {
      try {
        const userLogged = await this.service.verfiyRefreshToken(req.params.refreshToken || req.body.refreshToken)
        req.user = userLogged
        next()
      } catch (err) {
        next(err)
      }
    }
  
    async handleLogout (req, res, next) {
      const token = req.token
      await this.service.blockAccessToken(token)
      res.sendStatus(200);
    }
  
    async handleLogin (req, res, next) {
      const payload = {
        id: req.user._id,
        role: req.user.role
      };

      const [accessToken, refreshToken] = await this.service.criaTokens(payload)
      res.set('Authorization', accessToken);
      res.status(200).send({ refreshToken, accessToken });
    }
    
    async handleRegister (req, res, next) {
      const body = req.body
    
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        if (typeof body.role === 'string') {
          body.role = parseInt(body.role)
        }
        const newUser = await this.service.buildUsuario(body)
        const userCreated = await this.service.createUser(newUser)

        res
          .status(201)
          .send(userCreated)
      } catch (err) {
        if (err.errors) {
          let reportErrors = {}
          for (const prop in err.errors) {
            Object.assign(reportErrors, {[prop]: err.errors[prop].message})
          }
          return res
            .status(406)
            .send({ error: reportErrors })
        }
        next(err)
      }
    }
  }

  return LoginResource
}
