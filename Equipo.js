const mongoose = require('mongoose')

const equipoSchema = new mongoose.Schema({
    nombre: String,
    posicion:  Number,
    partidosJugados: Number,
    partidosGanados: Number,
    partidosPerdidos: Number,
    partidosPerdidos: Number,
    puntos: Number,
    goles: Number,
    golesContra: Number,
    diferenciaPuntos: Number,
    escudo: String
})

module.exports = mongoose.model("Equipo", equipoSchema)