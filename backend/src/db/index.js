const AllowList = require('./AllowList')
const BlockList = require('./BlockList')
const Exposicao = require('./Exposicao')
const ResetPasswordToken = require('./ResetPasswordToken')
const UserMongoose = require('./User')

module.exports = [
  UserMongoose,
  AllowList,
  BlockList,
  ResetPasswordToken,
  Exposicao
]
