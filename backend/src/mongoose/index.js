const mongoose = require('mongoose');
const Order = require('../models/pedidos');

function connectMongo(io) {
  mongoose
    .connect(
      process.env.MONGOOSE_CONNECTION_STRING,
      {
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
          io.emit('changeData', change);
        });
      }
    )
    .then(() => {
      console.log('Conectado ao MongoDB Atlas !');
    })
    .catch(error => {
      console.log('erro ao conectar no MongoDB : ', error);
    });
}

module.exports = connectMongo;
