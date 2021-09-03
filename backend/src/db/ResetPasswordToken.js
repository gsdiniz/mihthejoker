const mongoose = require('mongoose')

const schema = mongoose.Schema({
  token: { type: String },
  user: mongoose.Schema.Types.ObjectId,
  expires_at: { type: Date, required: true }
})

module.exports = ['ResetPasswordToken', schema]
