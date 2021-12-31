const Router = require('express').Router()
const { body } = require('express-validator');
module.exports = (expressApp) => {

  const Resource = new expressApp.domain.Exposicao.Resource(
    new expressApp.domain.Exposicao.Service(
      new expressApp.domain.Exposicao.Repository(
        new expressApp.mongoDB.model('Exhibition')
      )
    )
  )

  Router
    .route('/exposicao/visitar/:expositor/:video')
    .get(
      (req, res, next) => Resource.exposicoesVisualizarVideo(req, res, next)
    )

  Router
    .route('/exposicao/visitar')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'read')
      ],
      (req, res, next) => Resource.exposicoesParaVisitacao(req, res, next)
    )


  Router
    .route('/exposicao')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'read')
      ],
      (req, res, next) => Resource.handelGetAll(req, res, next)
    )
    .post(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'create'),
        expressApp.middlewares.upload(/mp4/, {files: 1, fieldSize: 102400000 }).single('video'),
        body('nome')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Nome da exposição não pode ser vazio')
        .isAlphanumeric('pt-BR', {ignore: ' -'})
        .withMessage('Nome da exposição inválido')
        .trim().escape(),
        body('localidade')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Local da exposição não pode ser vazio')
        .isAlphanumeric('pt-BR', {ignore: ' -'})
        .withMessage('Local da exposição inválido')
        .trim().escape(),
      ],
      (req, res, next) => Resource.handlePost(req, res, next)
    )

  Router
    .route('/exposicao/count')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'read')
      ],
      (req, res, next) => Resource.handleCount(req, res, next)
    )

  Router
    .route('/exposicao/:id')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'read'),
      ],
      (req, res, next) => res.status(200).send({})
    )
    .put(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'update'),
        expressApp.middlewares.upload(/mp4/, {files: 1, fieldSize: 102400000 }).single('video'),
        body('nome')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Nome da exposição não pode ser vazio')
        .isAlphanumeric('pt-BR', {ignore: ' -'})
        .withMessage('Nome da exposição inválido')
        .trim().escape(),
        body('localidade')
        .exists({checkNull: true, checkFalsy: true})
        .withMessage('Local da exposição não pode ser vazio')
        .isAlphanumeric('pt-BR', {ignore: ' -'})
        .withMessage('Local da exposição inválido')
        .trim().escape(),
      ],
      (req, res, next) => Resource.handlePut(req, res, next)
    )
    .delete(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exposicao', 'delete')
      ],
      (req, res, next) => Resource.handleDelete(req, res, next)
    )

  return Router
}
