const mongoose = require('mongoose')

const schema = mongoose.Schema({
  token: { type: String },
  expires_at: { type: Date, required: true }
})

module.exports = ['BlockList', schema]
