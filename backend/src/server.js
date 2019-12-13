const express = require('express');
const cors = require('cors');

require('./mongoose');

const server = express();

server.use(express.json());
server.use(cors());

require('./routes/apiRoutes')(server);

// const port = 3300;
// server.listen(port, () => {
//   console.log(`*-*-*-*-*-  Servidor ativo , rodando na porta: ${port} *-*-*-*-*-*-*`);
// });

module.exports = server;
