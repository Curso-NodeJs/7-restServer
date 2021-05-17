const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearProducto, actualizarProducto, obtenerProductos, obtenerProductoById, borrarProducto } = require('../controllers/productos.controller');
const { existeCategoriaPorID, existeProductoPorID } = require('../helpers/db-validators');

const router = Router();

router.get('/', 
           [
            validarJWT,
           ]
           , obtenerProductos);

router.get('/:id',
            [
                validarJWT,
                check('id','No es un id mongo valido').isMongoId(),
                check('id').custom( existeProductoPorID ),
                validarCampos
            ],obtenerProductoById);

router.post('/', 
            [
                validarJWT,
                check('nombre','El nombre es obligatorio').not().isEmpty(),
                check('categoria','La categoría es obligatoria').not().isEmpty(),
                validarCampos,
                check('categoria','debe tener un id valido de categoría').isMongoId(),
                check('categoria').custom( existeCategoriaPorID ),
                validarCampos
            ] , crearProducto);

router.put('/:id', 
            [
                validarJWT,
                check('id','No es un id mongo valido').isMongoId(),
                check('id').custom( existeProductoPorID ),
                check('categoria','debe tener un id valido de categoría').isMongoId(),
                validarCampos,
                check('categoria','No existe categoria').custom( existeCategoriaPorID ),
                validarCampos
            ] , actualizarProducto);

router.delete('/:id',
            [
              validarJWT,
              esAdminRole,
              check('id','No es un id mongo valido').isMongoId(),
              validarCampos,
              check('id').custom( existeProductoPorID ),
              validarCampos
            ]
            ,borrarProducto);

module.exports = router;