const mongoose = require('mongoose')
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const schema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [emailRegex, 'Formato do e-mail é inválido']
  },
  password: {
    type: String,
    required: true
  },
  disabled: { type: Boolean, default: false },
  emailVerified: { type: Boolean, required: true, default: false },
  displayName: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  photoURL: String,
  role: {
    type: Number,
    required: [true, 'Perfil é obrigatório'],
    index: true,
    default: 0,
    enum: [0, 1, 2]
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

module.exports = ['User', schema]
