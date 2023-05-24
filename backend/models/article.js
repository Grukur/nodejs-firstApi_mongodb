
'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

module.exports = mongoose.model('Article', articleSchema);
// cuando se crea una coleccion se guarda como articles
