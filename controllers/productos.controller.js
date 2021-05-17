const { response, request } = require("express")
const { Producto, Categoria } = require('../models')


const crearProducto = async (req = request, res = response)=> {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaID = req.body.categoria;
    const { estado,...data} = req.body;
    data.usuario = req.usuario._id;
    data.nombre = nombre;
    
    const productoDB = await Producto.findOne({ nombre });
    if (productoDB){
        return res.status(404).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }
    
    // validar que la categoría exista
    const categoria = await Categoria.findById( categoriaID );
    if (!categoria){
        return res.status(404).json({
            ok:false,
            msg: `La categoría ${ categoriaID }, No existe`
        });
    }
    
    const producto = await new Producto( data );
    await producto.save();
    res.json({
        ok: true,
        producto
    })
}

const obtenerProductos = async (req=request,res=response) => {
    const { limite=10, desde=0 } = req.query;
    const query = { estado: true };
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate('categoria','nombre')
                .populate('usuario','nombre')
                .skip(Number(desde)).limit(Number(limite))
    ]);
    
    return res.json({
        ok: true,
        total,
        productos
    });
}

// obtener producto - populate
const obtenerProductoById = async (req=request,res=response) => {
    const { id } = req.params;
    const producto = await Producto.findById( id ).populate('categoria','nombre').populate('usuario','nombre');
    return res.json({
        ok: true,
        producto
    });
}

const actualizarProducto = async (req = request, res = response)=>{
    const { id } = req.params;
    const { estado, usuario, nombre,...data} = req.body;
    data.usuario = req.usuario._id;
    
    let producto = await Producto.findById(id);
    
    if(nombre && producto.nombre !== nombre.toUpperCase()){
        const query = { nombre: nombre.toUpperCase() }
        const existeNombre  = await Producto.findOne(query);
        if(existeNombre){
            return res.status(400).json({
                ok: false,
                msg:'Producto ya existe'
            });
        }
    }
    
    if(nombre){
        data.nombre = nombre.toUpperCase();
    }
    
    producto = await Producto.findByIdAndUpdate( id, data, { new: true } ).populate('categoria','nombre');
    return res.json({
        ok: true,
        producto
    });
    
}


const borrarProducto = async (req=request,res=response) => {
    const { id } = req.params;
    const productoBorrar = await Producto.findByIdAndUpdate(id,{ estado: false }, { new: true });
    return res.json({
        ok: true,
        producto:productoBorrar
    })
}


module.exports = {
    crearProducto,
    actualizarProducto,
    obtenerProductos,
    obtenerProductoById,
    borrarProducto
}