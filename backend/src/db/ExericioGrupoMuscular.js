const mongoose = require('mongoose')

const schema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do grupo muscular de exercicíos é obrigatório'],
    index: true,
    unique: true,
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

module.exports = ['ExericioGrupoMuscular', schema]
