const { response, request } = require("express")
const { Categoria } = require('../models')

// obtener categorias - paginado - total - populate
const obtenerCategorias = async (req=request,res=response) => {
    const { limite=10, desde=0 } = req.query;
    const query = { estado: true };
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario','nombre').skip(Number(desde)).limit(Number(limite))
        
    ]);
    
    return res.json({
        ok: true,
        total,
        categorias
    });
}
// obtener categoria - populate
const obtenerCategoriaById = async (req=request,res=response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario','nombre');
    return res.json({
        ok: true,
        categoria
    })
}

const crearCategoria = async (req = request, res = response)=> {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    
    if (categoriaDB) {
        return res.status(404).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }
    
    // Generar la data a guardar 
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    
    const categoria = await new Categoria(data);
    
    // Guardar DB
    await categoria.save();
    return res.status(201).json({
        ok: true,
        categoria
    });
}

// actualizar categoria
const actualizarCategoria = async (req=request,res=response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );
    return res.json({
        ok: true,
        categoria
    })
}

// borrar categoria - estado false
const borrarCategoria = async (req=request,res=response) => {
    const { id } = req.params;
    const categoriaBorrar = await Categoria.findByIdAndUpdate(id,{ estado: false }, { new: true });
    //categoriaBorrar.usuario = req.usuario._id;
    return res.json({
        ok: true,
        categoria:categoriaBorrar
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCategoria,
    borrarCategoria
}