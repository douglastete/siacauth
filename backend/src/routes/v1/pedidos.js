const express = require('express');

const routes = express.Router();

const orderCtrl = require('../../controllers/pedidosCtrl');

routes.post('/', orderCtrl.store);
routes.get('/', orderCtrl.getAll);
routes.get('/:id', orderCtrl.getById);
routes.put('/:id', orderCtrl.update);
routes.delete('/:id', orderCtrl.delete);

module.exports = routes;
