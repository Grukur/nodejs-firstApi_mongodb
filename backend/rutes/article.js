'use strict'

let express = require('express');
let articleController = require('../controllers/article');
const { model } = require('mongoose');

let router = express.Router();
let multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir: './upload/articles'});

//Rutas para prueba
router.get('/test-controller', articleController.test);
router.post('/datos-curso', articleController.datosCurso);

//Rutas para articulos
router.post('/save', articleController.save);
router.get('/articles/:last?', articleController.getArticles);
router.get('/article/:id', articleController.getArticle);
router.put('/article/:id', articleController.update);
router.delete('/article/:id', articleController.delete);
router.post('/upload-image/:id', md_upload, articleController.upload);
router.get('/get-image/:image', articleController.getImage);
router.get('/search/:search', articleController.search);



module.exports = router;