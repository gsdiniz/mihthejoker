const Router = require('express').Router()
const { body } = require('express-validator');
module.exports = (expressApp) => {

  const ExercicioCategoriaDomain = expressApp.domain.v1.ExercicioCategoria.index
  const ExercicioCategoriaResource = new ExercicioCategoriaDomain.resource (
    new ExercicioCategoriaDomain.service (
      new ExercicioCategoriaDomain.repository (expressApp.mongoDB.model('ExercicioCategoria'))
    )
  )

  Router
    .route('/exercicio-categoria')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioCategoria', 'read')
      ],
      (req, res, next) => ExercicioCategoriaResource.handleGetAll(req, res, next)
    )
    .post(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioCategoria', 'create'),
        body('nome', 'Nome da categoria é inválido').trim().escape()
      ],
      (req, res, next) => ExercicioCategoriaResource.handlePost(req, res, next)
    )

  Router
    .route('/exercicio-categoria/count')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioCategoria', 'read')
      ],
      (req, res, next) => ExercicioCategoriaResource.handleCount(req, res, next)
    )

  Router
    .route('/exercicio-categoria/:id')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioCategoria', 'read'),
      ],
      (req, res, next) => ExercicioCategoriaResource.handleGetOne(req, res, next)
    )
    .put(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioCategoria', 'update'),
        body('nome', 'Nomde da categoria é inválido').trim().escape()
      ],
      (req, res, next) => ExercicioCategoriaResource.handlePut(req, res, next)
    )
    .delete(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioCategoria', 'delete')
      ],
      (req, res, next) => ExercicioCategoriaResource.handleDelete(req, res, next)
    )

  return Router
}
