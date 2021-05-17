const { Router } = require('express');
const { buscar } = require('../controllers/buscar.controllers');
const { validarJWT } = require('../middlewares');
const router = Router();

router.get('/:coleccion/:termino',[
    validarJWT
],buscar)


module.exports = router;