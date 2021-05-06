const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config.database');


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/user';
        
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
        this.app.use( express.json() )
        
        // Directorio publico
        this.app.use( express.static('public') );
    }
    
    routes() {
        this.app.use( this.usuariosRoutePath, require('../routes/user.routes'));
    }
    
    listen() {
        this.app.listen( this.port, () => console.log(`servidor corriendo en el puerto ${ this.port }`))
    }
}

module.exports = Server;