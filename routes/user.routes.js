const { Router } = require('express');
const { check } = require('express-validator');
const { userGet,
       userPut ,
       userPost, 
       userDelete, 
       userPatch } = require('../controllers/user.controllers');
const { esRoleValido, emailExiste, usuarioPorIdExiste } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');


const router = Router();

router.get('/', userGet );

router.put('/:id', [
       check('id','No es un ID válido').isMongoId(),
       check('id').custom( usuarioPorIdExiste ),
       check('rol').custom( esRoleValido ),
       validarCampos,
     ],
       userPut);

router.post('/', 
            [
              check('nombre','El nombre es obligatorio').not().isEmpty(),
              check('password','El password es obligatorio y debe ser de minimo 6 caracteres').isLength({ min: 6 }),
              check('correo','El correo no es válido').isEmail(),
              check('correo').custom( emailExiste ),
              /* check('rol','no es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']), */
              check('rol').custom( esRoleValido ),
              validarCampos,
            ]
             ,userPost);

router.delete('/:id',
              [
                validarJWT,
                check('id','No es un ID válido').isMongoId(),
                check('id').custom( usuarioPorIdExiste ),
                validarCampos,
              ]      
              , userDelete);

router.patch('/', userPatch);


module.exports = router;