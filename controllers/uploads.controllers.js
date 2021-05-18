const { response, request } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");
const path = require("path");
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

// se agrega los cliente id y secret para poder usar Cloudinary
cloudinary.config( process.env.CLOUDINARY_URL );

// cargar archivo localmente
const cargarArchivo = async (req=request, res=response)=>{

  try {
      const nombreArchivo = await subirArchivo(req.files, undefined,'prueba')
      return res.json({
        nombre: nombreArchivo
    })
  } catch (error) {
      return res.status(400).json({
          ok: false,
          msg: error
      })
  }
  
}

// Actualizar imagen localmente
const actualizarImagen = async (req=request,res=response)=>{
    

    const {id, coleccion} = req.params;
    
    let modelo;
    
    switch ( coleccion ) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                  return res.status(400).json({
                      msg: `No existe un usuario con el id ${ id }`
                  });  
                }
                
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });  
            }
            
        break;        
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Colección no validada desde el servidor'
            })
            break;
    }
    
    // limpiar imagenes previas
    
    if( modelo.img ){
        // hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, `../uploads/${ coleccion }/${ modelo.img }`);
        if ( fs.existsSync( pathImagen ) ){
            fs.unlinkSync(pathImagen);
        }
    }
    
    const nombreArchivo = await subirArchivo(req.files, undefined,coleccion)
    modelo.img = nombreArchivo;
    modelo.save();
    
    res.json({
        ok: true,
        modelo
    })
}

// actualizar imagen en cloudinary
const actualizarImagenCloudinary = async (req=request,res=response)=>{
    

    const {id, coleccion} = req.params;
    
    let modelo;
    
    switch ( coleccion ) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                  return res.status(400).json({
                      msg: `No existe un usuario con el id ${ id }`
                  });  
                }
                
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });  
            }
            
        break;        
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Colección no validada desde el servidor'
            })
            break;
    }
    
    // limpiar imagenes previas
    if( modelo.img ){
        // TODO: pendiente validar si la imagen existe y borra la imagen anterior
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath } = req.files.archivo;
    
    
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;
    modelo.save();
    
    res.json({
        ok: true,
        modelo
    })
}
// mostrar imagen localmente
const mostrarImagen = async (req=request, res=response) =>{
    const {id, coleccion} = req.params;
    
    let modelo;
    
    switch ( coleccion ) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo){
                  return res.status(400).json({
                      msg: `No existe un usuario con el id ${ id }`
                  });  
                }
                
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });  
            }
            
        break;        
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Colección no validada desde el servidor'
            })
            break;
    }
    
    // entregar imagen guardada
    
    if( modelo.img ){
        // hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, `../uploads/${ coleccion }/${ modelo.img }`);
        if ( fs.existsSync( pathImagen ) ){
            return res.sendFile(pathImagen);
        }
    }
    
    const noImg = path.join(__dirname, `../uploads/no-image.jpg`);
    return res.sendFile(noImg);

    
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}