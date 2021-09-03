const Router = require('express').Router()
const { body } = require('express-validator');
module.exports = (expressApp) => {

  const Domain = expressApp.domain.v1.ExercicioGrupoMuscular.index
  const Resource = new Domain.resource (
    new Domain.service (
      new Domain.repository (expressApp.mongoDB.model('ExericioGrupoMuscular'))
    )
  )

  Router
    .route('/exercicio-grupo-muscular')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioGrupoMuscular', 'read')
      ],
      (req, res, next) => Resource.handleGetAll(req, res, next)
    )
    .post(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioGrupoMuscular', 'create'),
        body('nome', 'Nome da categoria é inválido').trim().escape()
      ],
      (req, res, next) => Resource.handlePost(req, res, next)
    )

  Router
    .route('/exercicio-grupo-muscular/count')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioGrupoMuscular', 'read')
      ],
      (req, res, next) => Resource.handleCount(req, res, next)
    )

  Router
    .route('/exercicio-grupo-muscular/:id')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioGrupoMuscular', 'read'),
      ],
      (req, res, next) => Resource.handleGetOne(req, res, next)
    )
    .put(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioGrupoMuscular', 'update'),
        body('nome', 'Nomde do grupo é inválido').trim().escape()
      ],
      (req, res, next) => Resource.handlePut(req, res, next)
    )
    .delete(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicioGrupoMuscular', 'delete')
      ],
      (req, res, next) => Resource.handleDelete(req, res, next)
    )

  return Router
}
