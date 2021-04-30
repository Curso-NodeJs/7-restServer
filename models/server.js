const express = require('express');
var cors = require('cors')


class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/user';
        
        // Middlewares
        this.middlewares();
        
        //Rutas de la aplicación        
        this.routes();
    }
    
    middlewares(){
        // CORS
        this.app.use( cors());
        
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