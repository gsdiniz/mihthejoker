const mongoose = require('mongoose')

const schema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da categoria de exercicíos é obrigatório'],
    index: true,
    unique: true,
    trim: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

module.exports = ['ExercicioCategoria', schema]
