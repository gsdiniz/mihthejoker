const mongoose = require('mongoose')

const schema = mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do exercicío é obrigatório'],
    index: true,
    unique: true,
    trim: true,
  },
  categoria : { type: mongoose.Schema.Types.ObjectId, ref: 'ExercicioCategoria' },
  grupoMuscular : [{ type: mongoose.Schema.Types.ObjectId, ref: 'ExericioGrupoMuscular' }],
  gif: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

module.exports = ['Exercicio', schema]
