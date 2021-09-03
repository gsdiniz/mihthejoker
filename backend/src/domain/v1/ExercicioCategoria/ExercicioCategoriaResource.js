const { validationResult } = require('express-validator')

module.exports = (expressApp) => {
  class ExercicioCategoriaResource {
    constructor (service) {
      this.service = service
    }

    _returnValidationErrors (res, code, errors) {
      return res.status(code).send({ code, errors })
    }

    async handleGetAll (req, res, next) {
      try {
        this._verifyPermissions(req)
        const lista = await this.service.getAll(req.query)
        res.status(200).send(lista)
      } catch (err) {
        next(err)
      }
    }

    async handleCount (req, res, next) {
      this._verifyPermissions(req)
      const lista = await this.service.getAll(req.query)
      res.status(200).send(lista)
    }

    async handleGetOne (req, res, next) {
      
    }

    async handlePost (req, res, next) {
      const body = req.body
      try {
        this._verifyPermissions(req)
        const errors = validationResult(req);

        if  (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        const created = await this.service.create(body)
        res.status(201).send(created)
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

    async handlePut (req, res, next) {
      const body = req.body
      try {
        this._verifyPermissions(req)
        const errors = validationResult(req);

        if  (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        const created = await this.service.update(req.params.id, body)
        res.status(200).send(created)
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

    async handleDelete (req, res, next) {
      try {
        this._verifyPermissions(req)
        await this.service.remove(req.params.id)
        res.sendStatus(204)
      } catch (err) {
        next(err)
      }
    }
  
    _verifyPermissions (req) {
      let hasAnyPermission = req.permissions.any.granted
        
      if ( !hasAnyPermission && req.permissions.own.granted && 
        (req.user._id !== req.params.userId || req.user._id !== req.body.userId)) {
        throw new expressApp.helpers.error.Forbidden()
      }
    }
  }
  
  return ExercicioCategoriaResource
}
