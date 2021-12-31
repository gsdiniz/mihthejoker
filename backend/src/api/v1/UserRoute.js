const Router = require('express').Router()
const { body, query } = require('express-validator');

const passwordRules = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}

module.exports = (expressApp) => {

  const UserDomain = expressApp.domain.User.index
  const userResource = new UserDomain.resource (
    new UserDomain.service (
      new UserDomain.repository (expressApp.mongoDB.model('User')),
      expressApp.appConfig.jwtSecret,
      
    )
  )

  Router
    .route('/user')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('user', 'read')
      ],
      (req, res, next) => userResource.handleGetAll(req, res, next)
    )

  Router
    .route('/user/count')
    .get(
      expressApp.middlewares.passport.isAuthenticated.bearer,
      (req, res, next) => userResource.handleCount(req, res, next)
    )

  Router
    .route('/user/reset-password')
    .post(
      [
        query('token', 'Token inválido').isHexadecimal(),
        body('password', 'Senha inválida').isStrongPassword(passwordRules),
        body('password_check', 'Confirmar senha inválido').isStrongPassword(passwordRules)
      ],
      (req, res, next) => userResource.resetPassword(req, res, next)
    )

  Router
    .route('/user/lost-password')
    .post(
      body('email', 'E-mail inválido').isEmail().normalizeEmail(),
      (req, res, next) => userResource.lostPassword(req, res, next)
    )

  Router
    .route('/user/verifyEmail')
    .get(
      (req, res, next) => userResource.verifyEmail(req, res, next)
    )

  Router
    .route('/user/:id')
    .get(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('user', 'read')
      ],
      (req, res, next) => userResource.handleGetOne(req, res, next)
    )
    .put(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('user', 'update')
      ],
      (req, res, next) => userResource.handlePut(req, res, next)
    )
    .delete(
      [
        expressApp.middlewares.passport.isAuthenticated.bearer,
        expressApp.middlewares.acl('user', 'delete')
      ],
      (req, res, next) => userResource.handdleDelete(req, res, next)
    )

  return Router
}
