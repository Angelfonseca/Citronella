require('dotenv').config();
const jwt = require('jwt-simple');
const moment = require('moment');
const { handleHttp } = require('../utils/error.handle');

const secret = process.env.SECRET_JWT || '';

const ensureAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return handleHttp(res, 401, 'AUTHORIZATION ERROR');
  }

  // Extraer el token eliminando el prefijo 'Bearer '
  const token = req.headers.authorization.replace(/['"]+/g, '').split(' ')[1];
  let payload;
  try {
    payload = jwt.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return handleHttp(res, 401, 'AUTHORIZATION TOKEN EXPIRED');
    }
  } catch (error) {
    return handleHttp(res, 401, 'INVALID AUTHORIZATION TOKEN');
  }

  req.user = payload;
  next();
};

 const verifyToken = (token) => {
  return jwt.decode(token, secret);
}

module.exports = {ensureAuth, verifyToken};