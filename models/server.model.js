const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload')
const { dbConnection } = require('../database/config.database');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            user:       '/api/user',
            auth:       '/api/auth',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }
        
        // Conectar a base de datos
        this.conectarDB();
        
        // Middlewares
        this.middlewares();
        
        //Rutas de la aplicación        
        this.routes();
    }
    
    async conectarDB(){
        await dbConnection();
    }
    
    middlewares(){
        // CORS
        this.app.use( cors());
        
        // Lectura y Parseo del body
        this.app.use( express.json() );
        
        // Directorio publico
        this.app.use( express.static('public') );
        
        // Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true,
        }));
    }
    
    routes() {
        this.app.use( this.paths.user , require('../routes/user.routes'));
        this.app.use(this.paths.auth , require('../routes/auth.routes'));
        this.app.use(this.paths.categorias , require('../routes/categorias.routes'));
        this.app.use(this.paths.productos , require('../routes/productos.routes'));
        this.app.use(this.paths.buscar , require('../routes/buscar.routes'));
        this.app.use(this.paths.uploads , require('../routes/uploads.routes'));
    }
    
    listen() {
        this.app.listen( this.port, () => console.log(`servidor corriendo en el puerto ${ this.port }`));
    }
}

module.exports = Server;