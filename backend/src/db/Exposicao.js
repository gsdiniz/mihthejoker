const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    index: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  localidade: {
    type: String,
    required: [true, 'Local é obrigatório'],
    index: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  videoURL: String,
  expositor: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

module.exports = ['Exhibition', schema]
