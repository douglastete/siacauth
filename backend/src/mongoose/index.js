const mongoose = require('mongoose');
const http = require('http');

const { SERVER_PORT = 3000 } = process.env;
const server = http.createServer((req, res) => {
  res.end('Hello World!');
});

const serverIO = require('socket.io')(server, { serveClient: false });
const Order = require('../models/pedidos');

mongoose
  .connect(
    'mongodb+srv://douglas:manager@cluster0-xp2rg.mongodb.net/siacauth?retryWrites=true&w=majority',
    {
      // .connect('mongodb://localhost:27017/siacauth?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    err => {
      if (err) {
        console.log(`[SERVER_ERROR] MongoDB Connection:`, err);
        process.exit(1);
      }

      Order.watch().on('change', change => {
        console.log(`[SERVER_CHANGE_STREAM] User:`, change);
        serverIO.emit('changeData', change);
      });

      server.listen(SERVER_PORT, () => {
        console.log(`[SERVER] Running at ${SERVER_PORT}`);
      });
    }
  )
  .then(() => {
    console.log('Conectado ao MongoDB Atlas !');
  })
  .catch(error => {
    console.log('erro ao conectar no MongoDB : ', error);
  });

module.exports = mongoose;
