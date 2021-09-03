const Router = require('express').Router()
const { body } = require('express-validator');
module.exports = (expressApp) => {

  const ExercicioDomain = expressApp.domain.v1.Exercicio.index
  const ExercicioResource = new ExercicioDomain.resource (
    new ExercicioDomain.service (
      new ExercicioDomain.repository (expressApp.mongoDB.model('Exercicio'))
    )
  )

  Router
    .route('/exercicio')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicio', 'read')
      ],
      (req, res, next) => ExercicioResource.handleGetAll(req, res, next)
    )
    .post(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicio', 'create'),
        expressApp.middlewares.upload(/gif/).single('gif'),
        body('nome', 'Nome do exercício é inválido').trim().escape(),
        body('categoria', 'Categoria é inválida').isMongoId(),
        body('grupoMuscular', 'Categoria é inválida').isMongoId()
      ],
      (req, res, next) => ExercicioResource.handlePost(req, res, next)
    )

  Router
    .route('/exercicio/count')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicio', 'read')
      ],
      (req, res, next) => ExercicioResource.handleCount(req, res, next)
    )

  Router
    .route('/exercicio/:id')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicio', 'read'),
      ],
      (req, res, next) => ExercicioResource.handleGetOne(req, res, next)
    )
    .put(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicio', 'update'),
        expressApp.middlewares.upload(/gif/).single('gif'),
        body('nome', 'Nome do exercício é inválido').trim().escape(),
        body('categoria', 'Categoria é inválida').isMongoId(),
        body('grupoMuscular', 'Grupo Muscular é inválido').isMongoId()
      ],
      (req, res, next) => ExercicioResource.handlePut(req, res, next)
    )
    .delete(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('exercicio', 'delete')
      ],
      (req, res, next) => ExercicioResource.handleDelete(req, res, next)
    )

  return Router
}
