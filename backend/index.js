'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_test101', {useNewUrlParser:true})
    .then(()=>{
        console.log('Conexion establecida!!!');

        // crear servidor y escuchar peticiones
        app.listen(port, ()=>{
            console.log('Servidor corriendo en el puerto '+port);
        });

    });
