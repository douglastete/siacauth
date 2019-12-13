const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://douglas:manager@cluster0-xp2rg.mongodb.net/siacauth?retryWrites=true&w=majority', {
    // .connect('mongodb://localhost:27017/siacauth?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conectado ao MongoDB Atlas !');
  })
  .catch(error => {
    console.log('erro ao conectar no MongoDB : ', error);
  });

module.exports = mongoose;
