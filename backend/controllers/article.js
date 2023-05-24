'use strict'



let validator = require('validator');
let Article = require('../models/article');
let fs = require('fs');
let path = require('path');
const article = require('../models/article');


let controller = {
    datosCurso: (req, res) => {
        console.log('Post Node js');
        let hola = req.body.hola;
        return res.status(200).send({
            nombre: 'Darold K. Trench',
            profesor: 'Nelson',
            url: 'wwww.l.cl',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'soy la accion TEST de mi controlador de articulos'
        });
    },

    save: (req, res) => {
        //recoger los datos del usuario
        let params = req.body;
        console.log(params)

        //Validar datos (validador)
        let validate_title;
        let validate_content;
        try {
            validate_title = !validator.isEmpty(params.title);
            validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {
            //Crear el objeto a guardar
            let article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Guardar el articulo
            article.save()
                .then((articleStored) => {
                    return res.status(200).send({
                        status: 'success',
                        message: 'Articulo guardado',
                        article: articleStored
                    });
                })
                .catch((err) => {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Ocurrio un error al guardar el articulo'
                    });

                })

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },

    //Obtener todos los articulos
    getArticles: (req, res) => {
        let query = Article.find({})
        //last
        let last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        //find
        query.sort('-_id').exec()
            .then((articles) => {
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ocurrio un error al obtener los articulos'
                });
            });
    },

    //Obtiene un solo articulo
    getArticle: (req, res) => {
        //Recoger ID
        let id = req.params.id;
        //Comprobar que existe
        if (!id || id == null) {
            return res.status(400).send({
                status: 'error',
                message: 'No se envio el id del articulo'
            });
        }

        //Buscar el articulo
        Article.findById(id)
            .then((article) => {
                return res.status(200).send({
                    status: 'success',
                    article
                });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ocurrio un error al obtener el articulo, revise el ID ingresado'
                });
            });
    },

    //Update
    update: (req, res) => {
        //Recoger ID del articulo por la url
        let id = req.params.id;

        //Recoger los datos que llegan por put
        let params = req.body;

        //Validar datos
        let validate_title;
        let validate_content;
        try {
            validate_title = !validator.isEmpty(params.title);
            validate_content = !validator.isEmpty(params.content)
        } catch (err) {
            return res.status(404).send({
                status: 'error',
                message: 'No se envio ningun dato al servidor'
            });
        }

        //Comprobar que existe
        if (validate_title && validate_content) {
            //Find and Update
            Article.findByIdAndUpdate({ _id: id }, params, { new: true })
                .then((articleUpdated) => {
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                })
                .catch((err) => {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Ocurrio un error al actualizar el articulo, revise el ID ingresado'
                    });
                });

        } else {
            //Devolver respuesta
            return res.status(200).send({
                status: 'error',
                message: 'La validacion fue incorrecta'
            })
        }
    },

    //Borrador
    delete: (req, res) => {
        //Recoger id del articulo
        let id = req.params.id;

        //Find and delete
        Article.findByIdAndDelete({ _id: id })
            .then((articleDeleted) => {
                return res.status(200).send({
                    status: 'success',
                    article: articleDeleted
                });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ocurrio un error al eliminar el articulo, revise el ID ingresado'
                });
            });
    },

    //Upload
    upload: (req, res) => {

        //Configurar el modulo connect multiparty router/article.js (hecho en las rutas)

        //Recoger fichero de la peticion
        let file_name = 'Imagen no subida...'

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //Conseguir nombre y la extension del archivo
        let file_path = req.files.file0.path;
        let file_split = file_path.split('\\');

        //Nombre del archivo
        let file_nameOwn = file_split[2];

        //Extension del fichero
        let extension_split = file_nameOwn.split('\.');
        let file_ext = extension_split[1];

        //Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //Borrar fichero
            fs.unlink(file_path, (err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ocurrio un error al eliminar el fichero, revise la extensión'
                });
            });

        } else {
            //Si todo es valido, sacando id de la url
            let id = req.params.id;

            //Buscar el articulo, 
            Article.findOneAndUpdate({ _id: id }, { image: file_nameOwn }, { new: true })
                .then((articleUpdatedImage) => {
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdatedImage
                    });
                })
                .catch((err) => {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Ocurrio un error al guardar la imagen, revise la ruta'
                    });
                });
        }
    },

    getImage: (req, res) => {
        let file = req.params.image;
        let path_file = './upload/articles/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontro la imagen'
                });
            }
        });
    },

    search: (req, res) => {
        let searchString = req.params.search;
        console.log(searchString)

        Article.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec()
            .then((articles) => {
                if(!article || article.length <= 0){
                    return res.status(200).send({
                        status: 'error',
                        message: 'No se encontraron articulos'
                        });
                }
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            })
            .catch((err) => {
                return res.status(500).send({
                    status: 'error',
                    message: 'Ocurrio un error al buscar los articulos, revise la ruta'
                });
            });
    }

};// end controller

module.exports = controller;