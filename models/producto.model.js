
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    },
    precio:{
        type: Number,
        default: 0
    },
    categoria:{
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: true,  
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    descripcion:{
        type: String,
    },
    disponible:{
        type: Boolean,
        default: true,
    },
    img: {
        type: String,
    }
});

ProductoSchema.methods.toJSON = function() {
    const { __v,_id, ...producto } = this.toObject();
    producto.id = _id;
    return producto;
}


module.exports = model( 'Producto' , ProductoSchema );