const AllowList = require('./AllowList')
const BlockList = require('./BlockList')
const ResetPasswordToken = require('./ResetPasswordToken')
const UserMongoose = require('./User')
const ExercicioCategoria = require('./ExercicioCategoria')
const ExericioGrupoMuscular = require('./ExericioGrupoMuscular')
const Exercicio = require('./Exercicio')

module.exports = [
  UserMongoose,
  AllowList,
  BlockList,
  ResetPasswordToken,
  ExercicioCategoria,
  ExericioGrupoMuscular,
  Exercicio
]
