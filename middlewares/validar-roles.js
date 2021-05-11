const { response, request } = require('express');


const esAdminRole = (req = request,res = response, next)=>{
    if (!req.usuario){
        return res.status(500).json({
            ok: false,
            msg: 'Se quiere validar el rol sin validar el token primero'
        }); 
    }
    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            msg: `${ nombre } no está autorizado`
        });
    }
    next();
}

const tieneRol = (...roles )=>{
    return (req = request,res = response, next)=>{
        if (!req.usuario){
            return res.status(500).json({
                ok: false,
                msg: 'Se quiere validar el rol sin validar el token primero'
            }); 
        }
        
        if (!roles.includes( req.usuario.rol ) ){
            return res.status(401).json({
                ok: false,
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();   
    }
}

module.exports = {
    esAdminRole,
    tieneRol
}