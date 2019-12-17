const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 3300;

const server = express();
server.use(express.json());
server.use(cors());
require('./routes/apiRoutes')(server);

const httpServer = http.createServer(server);
const io = socketIO(httpServer);
require('./mongoose')(io);

httpServer.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});
