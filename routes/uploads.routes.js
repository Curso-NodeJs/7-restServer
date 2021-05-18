const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagenCloudinary, mostrarImagen } = require('../controllers/uploads.controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivo } = require('../middlewares');

const router = Router();

router.post('/', 
            [   validarArchivo,
                validarJWT
            ] ,cargarArchivo );

router.put('/:coleccion/:id',[
    validarArchivo,
    check('id','El id debe ser un mongo id valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios','productos']) ),
    validarCampos    
], actualizarImagenCloudinary)
    //actualizarImagen);

router.get('/:coleccion/:id', [
    check('id','El id debe ser un mongo id valido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios','productos']) ),
    validarCampos  
], mostrarImagen);
module.exports = router;