const mongoose = require('mongoose')
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const metadata = mongoose.Schema({
  phoneNumber: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/(^|\()?\s*(\d{2})\s*(\s|\))*(9?\d{4})(\s|-)?(\d{4})($|\n)/, 'Formato do telefone é inválido. Ex. 99 99999-9999']
  },
  uf: {
    type: String,
    min: 2,
    max: 2
  },
  cidade: {
    type: String,
    min: 3
  },
  bairro: {
    type: String,
    min: 3
  },
  cpf: {
    type: String,
    index: true,
    minLength: [11, 'CPF deve ter 11 digítos'],
    maxLength: [11, 'CPF deve ter 11 dígitos'],
    match: [/\d{11}/, 'CPF inválido, informe apenas dígitos']
  }
})

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
  metadata,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

module.exports = ['User', schema]
