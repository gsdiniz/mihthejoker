const { validationResult } = require('express-validator')
const fs = require('fs');

module.exports = (expressApp) => {
  class ExposicaoResource {
    constructor (service) {
      this.service = service
    }

    _returnValidationErrors (res, code, errors) {
      const err = [errors[0]]
      return res.status(code).send({ code, errors: err })
    }

    async exposicoesParaVisitacao (req, res, next) {
      try {
        this._verifyAnyPermissions(req)
        const lista = await this.service.exposicoesParaVisitacao(req.query)
        res.status(200).send(lista)
      } catch (err) {
        next(err)
      }
    }

    async exposicoesVisualizarVideo (req, res, next) {
      try {
        const { expositor, video } = req.params;
        const movieFile = `${expressApp.appConfig.uploadPath}/${expositor}/${video}`;
        fs.stat(movieFile, (err, stats) => {
          if (err) {
            console.log(err);
            return res.status(404).end();
          }
          const { range } = req.headers;
          const { size } = stats;
          const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
          const end = size - 1;
          const chunkSize = (end - start) + 1;
          res.set({
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
          });
          // É importante usar status 206 - Partial Content para o streaming funcionar
          res.status(206);
          const stream = fs.createReadStream(movieFile, { start, end });
          stream.on('open', () => stream.pipe(res));
          stream.on('error', (streamErr) => res.end(streamErr));
        });
      } catch (err) {
        next(err)
      }
    }

    async handleCount (req, res, next) {
      this._verifyPermissions(req)
      const total = await this.service.count()
      res.status(200).send(total)
    }

    async handleGetOne (req, res, next) {
      
    }

    async handelGetAll (req, res, next) {
      try {
        this._verifyOwnPermissions(req)

        const query = Object.assign({}, {...req.query})

        const lista = await this.service.getAll({expositor: req.user._id}, query)
        res.status(200).send(lista)
      } catch (err) {
        next(err)
      }
    }

    async handlePost (req, res, next) {
      try {
        this._verifyOwnPermissions(req)
        const errors = validationResult(req);

        if  (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        if  (!req.file) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, [{msg: 'Vídeo de exposição não enviado'}])
        }

        const expo = Object.assign({...req.body}, { videoURL: `${expressApp.appConfig.uploadView}/${req.file.filename}`, expositor: req.user._id })
        const created = await this.service.create(expo)
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
      let body = {}
      try {
        this._verifyOwnPermissions(req)
        const errors = validationResult(req);

        if  (!errors.isEmpty()) {
          return this._returnValidationErrors(res, expressApp.helpers.error.BadRequest.CODE, errors.array())
        }

        if  (!req.file) {
          body = Object.assign({...req.body}, { videoURL: `/${req.file.filename}`, expositor: req.user._id })
        }

        const updated = await this.service.update(req.params.id, body)
        res.status(200).send(updated)
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
        this._verifyOwnPermissions(req)
        const dir = `${expressApp.appConfig.uploadPath}/${req.user._id}`
        fs.rmdir(dir, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        
            console.log(`${dir} is deleted!`);
        });
        await this.service.remove(req.params.id)
        res.sendStatus(204)
      } catch (err) {
        next(err)
      }
    }
  
    _verifyAnyPermissions (req) {
      if ( !req.permissions.any.granted ) {
        throw new expressApp.helpers.error.Forbidden()
      }
    }

    _verifyOwnPermissions (req) {
      if ( !req.permissions.own.granted ) {
        throw new expressApp.helpers.error.Forbidden()
      }
    }
  }
  
  return ExposicaoResource
}
