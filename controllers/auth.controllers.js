const { response, request } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
    
    try {
        // Verificar el Email
        const usuario = await Usuario.findOne({ correo });
        if (!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - usuario'
            });
        }
        // Verificar si el usuario está activo
        if (!usuario.estado){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        // verificar la contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // Generar JWT
        const token = await generarJWT( usuario.id );
        res.json({
           ok:true,
           usuario,
           token 
        });
           
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador',
        })
    }
    
}


module.exports = {
    login,
}