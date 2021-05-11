const { response, request } = require('express');
const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');

const validarJWT = async (req = request, res = response, next) =>{
    const token = req.header('x-token');
    if (!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }
    
    try {
       const { uid } = jwt.verify( token , process.env.SECRETORPRIVATEKEY);
       req.uid = uid;
       // Lee el usuario que corresponde al UID
       const usuario = await Usuario.findById( uid );
       if (!usuario){
        return res.status(401).json({
            ok: false,
            msg: 'Usuario No existe'
        })
       }
       
       // verifica que el usuario esté activo
       if (!usuario.estado){
        return res.status(401).json({
            ok: false,
            msg: 'Usuario desactivado'
        })
       }
       req.usuario = usuario;
       next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }
    
} 

module.exports = {validarJWT};