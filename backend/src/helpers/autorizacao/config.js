const AccessControl = require('accesscontrol')
const Roles = require('./roles')()
const controle = new AccessControl()

module.exports = () => {
  controle
    .grant(
      Roles.getRoleLabelByCode(Roles.VISITANTE)
    )
    .readAny('exposicao')
    .readOwn('user')
    .updateOwn('user')
    .deleteOwn('user')

  controle
    .grant(Roles.getRoleLabelByCode(Roles.EXPOSITOR))
    .readOwn('exposicao')
    .createOwn('exposicao')
    .updateOwn('exposicao')
    .deleteOwn('exposicao')
    .readOwn('user')
    .updateOwn('user')
    .deleteOwn('user')

  controle
    .grant(Roles.getRoleLabelByCode(Roles.ADMIN))
    .extend(Roles.getRoleLabelByCode(Roles.EXPOSITOR))
    .readAny('user')
    .createAny('user')
    .updateAny('user')
    .deleteAny('user')

  return controle
}