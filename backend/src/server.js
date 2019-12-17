const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocketServer = require('ws').Server;
const port = process.env.PORT || 3300;

require('./mongoose');

const server = express();

server.use(express.json());
server.use(cors());
server.use(express.static(__dirname + '/'));

const httpServer = http.createServer(server);
httpServer.listen(port);

var wss = new WebSocketServer({ server: httpServer });
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {});
  }, 1000);

  ws.on('close', function() {
    clearInterval(id);
  });
});

require('./routes/apiRoutes')(server);
