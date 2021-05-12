const { response, request } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify'); 



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

const googleSignIn = async (req = request, res = response, next)=>{
    const { id_token } = req.body;
    try {
        const { correo, nombre, img } =  await googleVerify(id_token);
        // validar si correo existe en base de datos
        let usuario = await Usuario.findOne({ correo });
        if (!usuario){
            // si no existe tengo que crearlo
            const data = {
                nombre,
                correo,
                password: 'NoPassword',
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }
        
        // si el usuario en DB esta desactivado
        if (!usuario.estado) {
            return res.status(401).json({
               ok: false,
               msg:'Usuario Bloqueado' 
            });
        }
        
        // Generar JWT
        console.log(usuario);
        const token = await generarJWT( usuario.id );
        
        return res.json({
            ok:true,
            usuario,
            token
        })
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg:'Token de Google no es valido',
            ...error
            })
    }
}


module.exports = {
    login,
    googleSignIn
}