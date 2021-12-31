const Router = require('express').Router()
const AllowListRepository = require('../../domain/Login/AllowListRepository')
const BlockListRepository = require('../../domain/Login/BlockListRepository')
const { body } = require('express-validator');

const passwordRules = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
}

module.exports = (expressApp) => {
  const LoginDomain = expressApp.domain.Login.index

  const loginResource = new LoginDomain.resource(
    new LoginDomain.service( 
      new LoginDomain.repository(expressApp.mongoDB.model('User')),
      new AllowListRepository(expressApp.mongoDB.model('AllowList')),
      new BlockListRepository(expressApp.mongoDB.model('BlockList'))
    )
  ) 

  Router
    .route('/login/register')
    .post(
      [
        body('password', 'Senha inválida').isStrongPassword(passwordRules)
      ],
      (req, res, next) => loginResource.handleRegister(req, res, next)
    )

  Router
    .route('/login/refresh-token/:refreshToken')
    .get(
      (req, res, next) => loginResource.handleRefreshToken(req, res, next),
      (req, res, next) => loginResource.handleLogin(req, res, next)
    )

  Router
    .route('/logout')
    .post(
      [
        (req, res, next) => loginResource.handleRefreshToken(req, res, next),
        expressApp.middlewares.passport.isAuthenticated.bearer
      ],
      (req, res, next) => loginResource.handleLogout(req, res, next)
    )

  Router
    .route('/login')
    .post(
      expressApp.middlewares.passport.isAuthenticated.local,
      (req, res, next) => loginResource.handleLogin(req, res, next)
    )

  return Router
}
