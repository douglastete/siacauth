const firebaseAdmin = require('../firebase-admin');

async function jwtValidate(req, res, next) {
  try {
    const headers = req.headers.authorization ? req.headers.authorization.split(' ') : false;
    if (!headers || headers[0].toLowerCase() !== 'bearer') {
      return res.status(400).json({ success: false, message: 'Header não informado ou no formato inválido!' });
    }

    const token = headers[1] || '';
    if (!token) {
      return res.status(400).json({ success: false, message: 'Header no formato inválido!' });
    }

    const tokenData = await firebaseAdmin.auth().verifyIdToken(token);
    if (!tokenData) {
      return res.status(401).json({ success: false, message: 'Usuário não autorizado !' });
    }

    req.tokenData = tokenData;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, errorCode: error.code, message: error.message });
  }
}

module.exports = jwtValidate;
