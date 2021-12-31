const operations = {
  create: {
    any: 'createAny',
    own: 'createOwn',
  },
  read: {
    any: 'readAny',
    own: 'readOwn',
  },
  update: {
    any: 'updateAny',
    own: 'updateOwn',
  },
  delete: {
    any: 'deleteAny',
    own: 'deleteOwn',
  },
}

module.exports = (expressApp) => (recurso, acao) => (req, res, next) => {
  const permissionsByRole = expressApp.helpers.autorizacao.config.can(
    expressApp.helpers.autorizacao.roles.getRoleLabelByCode(req.user.role)
  )

  const actions = operations[acao]

  const actionsToAll = permissionsByRole[actions.any](recurso)
  const actionsToOwn = permissionsByRole[actions.own](recurso)

  if (actionsToAll.granted === false && actionsToOwn.granted === false) {
    next(new expressApp.helpers.error.Forbidden(`You shall not pass!`))
    return
  }

  req.permissions = {
    any: {
      granted: actionsToAll.granted,
      attributes: actionsToAll.attributes
    },
    own: {
      granted: actionsToOwn.granted,
      attributes: actionsToOwn.attributes
    }
  }

  next()
}
