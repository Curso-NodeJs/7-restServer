const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoriaById, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controllers');
const { existeCategoriaPorID } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

/**
*   {{url}}/api/categorias
 */

// Obtener todas las categorias
router.get('/', 
           [
            validarJWT,
           ]
           , obtenerCategorias);

// obtener una categoria por id
router.get('/:id',
           [
               validarJWT,
               check('id','No es un id mongo valido').isMongoId(),
               check('id').custom( existeCategoriaPorID ),
               validarCampos
           ],obtenerCategoriaById);

// crear categoria
router.post('/', 
            [ 
                validarJWT,
                check('nombre','El nombre es obligatorio').not().isEmpty(),
                validarCampos
            ] , crearCategoria);

// actualizar - privado - cualquiera con token valido
router.put('/:id',
           [
                validarJWT,
                check('id','No es un id mongo valido').isMongoId(),
                check('id').custom( existeCategoriaPorID ),
                validarCampos
            ],actualizarCategoria);

router.delete('/:id',
              [
                validarJWT,
                esAdminRole,
                check('id','No es un id mongo valido').isMongoId(),
                validarCampos,
                check('id').custom( existeCategoriaPorID ), 
                validarCampos
              ]
              ,borrarCategoria);

module.exports = router;