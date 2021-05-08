const Role = require('../models/role.model');
const Usuario = require('../models/usuario.model');

// verifica si el rol existe en la base de datos
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
           throw new Error(`El rol ${ rol } no Existe`)
    }
}

// Verificar si el correo existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail){
        throw new Error(`El correo ${ correo } ya Existe`)
    }
}

const usuarioPorIdExiste = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El usuario con id ${ id } no Existe`)
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    usuarioPorIdExiste,
}