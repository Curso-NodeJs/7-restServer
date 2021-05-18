const { request, response } = require("express")


const validarArchivo = (req=request, res=response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).json({
            ok: false,
            msg:'No hay archivos cargados.'
        });
        return;
      }
    next();
}

module.exports = {
    validarArchivo
}