const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocketServer = require('ws').Server;
const port = process.env.PORT || 3300;
const httpPort = process.env.HTTPPORT || 3301;

require('./mongoose');

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.static(__dirname + '/'));

const httpServer = http.createServer(server);
httpServer.listen(httpPort);

var wss = new WebSocketServer({ server: httpServer });
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {});
  }, 1000);

  console.log('websocket connection open');

  ws.on('close', function() {
    console.log('websocket connection close');
    clearInterval(id);
  });
});

require('./routes/apiRoutes')(server);

server.listen(port, () => console.log(`Servidor ativo na porta ${port}`));
