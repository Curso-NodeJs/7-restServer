const { Router } = require('express');
const { check } = require('express-validator');
const { userGet,
       userPut ,
       userPost, 
       userDelete, 
       userPatch } = require('../controllers/user.controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();



router.get('/', userGet );

router.put('/:id', userPut);

router.post('/', 
            [
              check('nombre','El nombre es obligatorio').not().isEmpty(),
              check('password','El password es obligatorio y debe ser de minimo 6 caracteres').isLength({ min: 6 }),
              check('correo','El correo no es válido').isEmail(),
              check('rol','no es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
              validarCampos
            ]
             ,userPost);

router.delete('/', userDelete);

router.patch('/', userPatch);


module.exports = router;