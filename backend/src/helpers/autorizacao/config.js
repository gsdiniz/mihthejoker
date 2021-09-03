const AccessControl = require('accesscontrol')
const Roles = require('./roles')()
const controle = new AccessControl()

module.exports = () => {
  controle
    .grant(
      Roles.getRoleLabelByCode(Roles.VISITANTE)
    )
    .readAny('tour')
    .readOwn('user')
    .updateOwn('user')
    .deleteOwn('user')

  controle
    .grant(Roles.getRoleLabelByCode(Roles.EXPOSITOR))
    .readOwn('tour')
    .createOwn('tour')
    .updateOwn('tour')
    .deleteOwn('tour')
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