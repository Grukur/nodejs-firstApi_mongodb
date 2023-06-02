'use strict'

//cargar modulos de node para crear servidos
let express = require('express');
let bodyParser = require('body-parser');


//Ejecutar express (hhtp)
let app = express();

//Cargar ficheros rutas
let article_routes = require('./rutes/article');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas / cargar rutas
app.use('/',article_routes);

//Ruta o metodo de prueba para mi api
app.get('/test', (req, res)=>{
    console.log('Hola mundo desde Node js');
    return res.status(200).send({
        curso: 'Master en Frameworks JS',
        profesor: 'Juan David Castro',
        url:'wwww.l.cl'
    });
});
/* app.post('/datos', (req, res)=>{
    console.log('Post Node js');
    let hola = req.body.hola;
    return res.status(200).send({
        nombre: 'Darold K. Trench',
        profesor: 'Nelson',
        url:'wwww.l.cl',
        hola

    });
}); */

//Exportar modulo (fichero actual)
module.exports = app;
