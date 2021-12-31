const Messages = require('./Messages')
const { validationResult } = require('express-validator')

module.exports = (expressApp) => {
  class UserResource {
    constructor (service) {
      this.service = service
    }

    _returnValidationErrors (res, code, errors) {
      return res.status(code).send({ code, errors })
    }

    async resetPassword (req, res, next) {
      try {
        const errors = validationResult(req);

        if  (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        const resetToken = await this.service.verifyResetPasswordToken(req.query.token)
        if (!resetToken) {
          throw new expressApp.helpers.error.BadRequest('Token não é válido')
        }

        if (!this.service.passwordResetMatch(req.body.password, req.body.password_check)) {
          throw new expressApp.helpers.error.BadRequest('Senha e Confirmação de senha não são iguais')
        }

        await this.service.updateOne(resetToken.user, { _id: resetToken.user, password: await this.service.generatePassword(req.body.password) })
        await this.service.removeResetPasswordToken(req.query.token)
        res.sendStatus(200)
      } catch (err) {
        next(err)
      }
    }

    async lostPassword (req, res, next) {
      try {
        const msgEnvio = 'Se o e-mail informado, [email], estiver cadastrado, nós enviaremos um e-mail com o link para renovação de senha'
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        const tokenRecoverToken = createResetPasswordToken(req.body.email);
        await this.service.sendMailRecoverPassword(`/reset-password`, req.body.email, tokenRecoverToken)
        res.status(200).send({ mensagem: msgEnvio.replace('[email]', req.body.email)})
      } catch (err) {
        next(err)
      }
    }
  
    async verifyEmail (req, res, next) {
      try {
        const token = req.query.token
        if (!token) {
          throw new expressApp.helpers.error.BadRequest('Token inválido')
        }

        await this.service.verifyEmail(token)
        res.status(200).send({ mensagem: 'Obrigado por confirmar o seu e-mail' })
      } catch (err) {
        next(err)
      }
    }
  
    async handleGetAll (req, res, next) {
      try {
        const users = await this.service.getAll(req.query)
        const total = await this.service.countUsers()
        const response = {
          total,
          users,
          limit: parseInt(req.query.limit) || 10,
          skip: parseInt(req.query.skip) || 0
        }
        res.setHeader('Content-Length', JSON.stringify(response).length)
        res.status(200)
          .send(response)
      } catch (err) {
        next(err)
      }
    }
    
    async handleCount (req, res, next) {
      try {
        const users = { total: await this.service.countUsers() }
        res.setHeader('Content-Length', JSON.stringify(users).length)
        res.status(200)
          .send(users)
      } catch (err) {
        next(err)
      }
    }
    
    async handleGetOne (req, res, next) {
      try {
        const user = await this.service
          .getById(req.params.id)
          .catch(err => {
            expressApp.logger.registerError(err)
            return null
          })
    
        if (user === null) {
          return res.status(404).send()
        }
    
        res.setHeader('Last-Modified', user.updated_at)
        res.setHeader('Content-Length', JSON.stringify(user).length)
        res.status(200)
          .send(user)
      } catch (err) {
        next(err)
      }
    }
    
    async handlePut (req, res, next) {
      try {
        if ( !req.permissions.any.granted && (req.user._id != req.params.id || req.user._id != req.body._id)) {
          throw new expressApp.helpers.error.Forbidden()
        }

        const body = req.body
        let id = req.user._id

        if (req.permissions.any.granted) {
          const user = await this.service
            .getById(req.params.id)
            .catch(err => {
              expressApp.logger.registerError(err)
              return null
            })
      
          if (user === null) {
            return res.sendStatus(404)
          }

          id = user._id
          body.version = user.version++
        }
    
        const result = await this.service.updateOne(id, body)
    
        res.setHeader('Content-Length', JSON.stringify(result).length)
        res.status(200)
          .send(result)
      } catch (err) {
        if (err.code == 11000) {
          expressApp.logger.registerError(err)
          err.codeOriginal = err.code
          err.code = 406
          err.message = Messages[err.codeName][Object.keys(err.keyValue)[0]]
        }
        next(err)
      }
    }
    
    async handdleDelete (req, res, next) {
      try {
        let hasAnyPermission = req.permissions.any.granted
        
        if ( !hasAnyPermission && req.permissions.own.granted && req.user._id !== req.params.id) {
          throw new expressApp.helpers.error.Forbidden()
        }

        await this.service.deleteOne(req.params.id)

        res.sendStatus(204)
      } catch (err) {
        next(err)
      }
    }
  }

  return UserResource
}
