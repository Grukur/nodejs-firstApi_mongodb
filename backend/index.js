'use strict'

var mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_test101', {useNewUrlParser:true})
    .then(()=>{
        console.log('Conexion establecida!!!');

    });