const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const userGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
      
      const  [total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
               .skip(Number(desde))
               .limit(Number(limite))
      ])
    res.json({
        ok: true,
        total,
        usuarios
    })
  }

  const userPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id ,password, google, correo, ...resto } = req.body;
    
    // Todo validar contra base de datos
    if(password){
      // Encriptar la contraseña
      const salt = bcrypt.genSaltSync(12);
      resto.password = bcrypt.hashSync( password, salt );
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    
    res.json({
        ok: true,
        usuario
    })
  }

const userPost = async (req, res = response) => {
    
    const { google, ...campos } = req.body;
    const usuario = new Usuario(campos);
        
    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(12);
    usuario.password = bcrypt.hashSync( campos.password, salt );
    
    // Guardar en base de datos
    await usuario.save();
    res.json({
        ok: true,
        msg: 'User Post API',
        usuario
    })
  }

  const userDelete = async (req, res = response) => {
    const { id } = req.params;
    
    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAutenticado = req.usuario;
    
    res.json({
        ok: true,
        msg: 'Usuario Borrado',
        usuario,
        //usuarioAutenticado
    })
  }
  
  const userPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Patch API'
    })
  }

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}