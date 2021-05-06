const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');

const userGet = (req = request, res = response) => {
    const { q='NoN', nombre='NoN' } = req.query;
    res.json({
        ok: true,
        msg: 'User Get API',
        q,
        nombre
    })
  }

  const userPut = (req, res = response) => {
    const id = req.params.id
    res.json({
        ok: true,
        msg: 'User Put API',
        id
    })
  }

const userPost = async (req, res = response) => {
    
    const { google, ...campos } = req.body;
    const usuario = new Usuario(campos);
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo: campos.correo });
    
    if (existeEmail){
      return res.status(404).json({
          ok: false,
          msg:'El correo ya está registrado'
        })
    }
    
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

  const userDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'User Delete API'
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