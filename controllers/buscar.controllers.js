const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto, Role } = require("../models");


const coleccionesPermitidas = [
  'usuarios',
  'categoria',
  'producto',
  'roles'  
];

const buscarUsuarios = async ( termino='',res = response )=>{
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.status(200).json({
            ok: true,
            results: ( usuario ) ? [usuario]:[]
        })
    }
    
    const regex = new RegExp( termino, 'i' )
    
    const usuarios = await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    });
    
    return res.status(200).json({
        ok: true,
        results: usuarios
    })
}


const buscarCategorias = async ( termino='',res = response )=>{
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
        return res.status(200).json({
            ok: true,
            results: ( categoria ) ? [categoria]:[]
        })
    }
    
    const regex = new RegExp( termino, 'i' )
    
    const categorias = await Categoria.find({nombre:regex, estado:true});
    
    
    return res.status(200).json({
        ok: true,
        results: categorias
    })
}


const buscarProductos = async ( termino='',res = response )=>{
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const producto = await (await Producto.findById(termino)).populate('categoria','nombre');
        return res.status(200).json({
            ok: true,
            results: ( producto ) ? [producto]:[]
        })
    }
    
    const regex = new RegExp( termino, 'i' )
    
    const productos = await Producto.find({nombre:regex, estado:true}).populate('categoria','nombre');
    
    
    return res.status(200).json({
        ok: true,
        results: productos
    })
}


const buscarRoles = async ( termino='',res = response )=>{
    const esMongoID = isValidObjectId(termino);
    if (esMongoID) {
        const rol = await Role.findById(termino);
        return res.status(200).json({
            ok: true,
            results: ( rol ) ? [rol]:[]
        })
    }
    
    const regex = new RegExp( termino, 'i' )
    
    const roles = await Role.find({rol:regex});
    
    
    return res.status(200).json({
        ok: true,
        results: roles
    })
}

const buscar = async (req=request, res=response)=>{
    const { coleccion, termino } = req.params;
    
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            ok: false,
            msg:`Las colecciones permitidas son ${ coleccionesPermitidas }`
        })
    }
    
    switch (coleccion) {
        case 'usuarios':
            await buscarUsuarios(termino, res);
            break;
        case 'categoria':
            await buscarCategorias(termino,res);
            break;
        case 'producto':
            await buscarProductos(termino,res);
        break;
        case 'roles':
            await buscarRoles(termino,res);
        break;
        default:
            res.status(500).json({
                ok: false,
                msg:'Contactar con el administrador'
            })
            break;
    }
    
}

module.exports = {
    buscar    
}