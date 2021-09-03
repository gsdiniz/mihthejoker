const passport = require('passport')
const crypto = require('crypto')
const config = require('../config')
const LocalStrategy = require('passport-local').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const strategiesForAuth = (expressApp) => (userDB, blockListDB = null) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'senha',
        session: false
      },
      async (email, senha, done) => {
        try {
          const usuario = await userDB.findOne({email})

          if (!usuario || !await bcrypt.compare(senha, usuario.password)) {
            throw new expressApp.helpers.error.Unauthorized('Usuário ou senha inválido')
          }

          if (!usuario || !await bcrypt.compare(senha, usuario.password)) {
            throw new expressApp.helpers.error.Unauthorized('Usuário ou senha inválido')
          }
  
          done(null, usuario)
        } catch (erro) {
          done(erro)
        }
      }
    )
  )
  
  passport.use(
    new BearerStrategy(
      async (token, done) => {
        try {
          if (blockListDB) {
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
            if (await blockListDB.findOne({ token: hashedToken })) {
              throw new expressApp.helpers.error.Unauthorized('Token logged out')
            }
          }

          const payload = jwt.verify(token, config.jwtSecret)
          const usuario = await userDB.findById(payload.id)
          done(null, usuario, { token: token })
        } catch (erro) {
          if (erro.name === 'TokenExpiredError') {
            return done(new expressApp.helpers.error.Forbidden('Token Expired'))
          }
          done(erro)
        }
      }
    )
  )
}

const isAuthenticated = {
  local: (req, res, next) => {
    passport.authenticate(
      'local',
      { session: false },
      (erro, usuario, info) => {
        if (erro) {
          return next(erro)
        }

        if (!usuario) {
          return res.sendStatus(401)
        }

        req.user = usuario
        return next()
      }
    )(req, res, next)
  },

  bearer: (req, res, next) => {
    passport.authenticate(
      'bearer',
      { session: false },
      (erro, usuario, info) => {

        if (erro) {
          return next(erro)
        }

        if (!usuario) {
          return res.sendStatus(401)
        }

        req.token = info.token
        req.user = usuario
        return next()
      }
    )(req, res, next)
  }
}

module.exports = (expressApp) => {
  return ({
    isAuthenticated,
    strategiesForAuth: strategiesForAuth(expressApp)
  })
}
