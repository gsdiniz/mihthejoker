const roles = [
  { code: 0, label: 'visitante' },
  { code: 1, label: 'expositor' },
  { code: 2, label: 'admin' }
]

class Roles {
  static VISITANTE = 0
  static EXPOSITOR = 1
  static ADMIN = 2

  static getRoleLabelByCode (code) {
    return roles.filter(role => role.code === code)[0].label
  }

  static getRoleCodeByLabel (label) {
    return roles.filter(role => role.label === label)[0].code
  }
}


export default Object.freeze(Roles)