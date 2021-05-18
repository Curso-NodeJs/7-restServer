# 7-restServer
Recuerden ejecutar 
```npm install```
para reconstruir los modulos

Se debe cambiar .enV en .env y agregar la conexión de la base de datos junto al puerto de ejecución


# para desplegar en heroku las variables de entorno:

heroku config:set PORT=8000
heroku config:set MONGODB_CNN=
heroku config:set SECRETORPRIVATEKEY=
heroku config:set GOOGLE_CLIENT_ID=
heroku config:set GOOGLE_SECRET_ID=
heroku config:set CLOUDINARY_URL=

# para ver los logs en heroku

heroku logs -n 100 --tail

