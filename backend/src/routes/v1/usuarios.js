const express = require('express');

const routes = express.Router();

const userCtrl = require('../../controllers/usuariosCtrl');

routes.post('/', userCtrl.store);
routes.get('/', userCtrl.getAll);
routes.get('/:id', userCtrl.getById);
routes.put('/:id', userCtrl.update);
routes.put('/', userCtrl.updateEmail);
routes.delete('/:id', userCtrl.delete);

module.exports = routes;
