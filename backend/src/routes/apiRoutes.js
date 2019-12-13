const express = require('express');
const jwtValidate = require('../middlewares/jwt');
const basicAuth = require('express-basic-auth');

function routesApiV1(server) {
  const v1 = express.Router();
  const siac = express.Router();

  v1.use('/users', jwtValidate, require('./v1/usuarios'));
  v1.use('/orders', jwtValidate, require('./v1/pedidos'));

  server.use('/api/v1', v1);

  const basic = basicAuth({ users: { SIAC: 'E4D5C374A10549429127C791DA022D85' }, challenge: true });

  siac.use('/users', basic, require('./v1/usuarios'));
  siac.use('/orders', basic, require('./v1/pedidos'));

  server.use('/api/siac/v1', siac);
}

module.exports = routesApiV1;
