
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        required: [true, 'El estado es obligatorio'],
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function() {
    const { __v,_id, ...categoria } = this.toObject();
    categoria.id = _id;
    return categoria;
}

module.exports = model( 'Categoria' , CategoriaSchema );