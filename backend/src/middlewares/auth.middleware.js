require('dotenv').config();
const jwt = require('jwt-simple');
const moment = require('moment');
const { handleHttp } = require('../utils/error.handle');


const secret = process.env.SECRET_JWT || '';

const ensureAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return handleHttp(res, 403, 'AUTHORIZATION ERROR');
  }
  const token = req.headers.authorization.replace(/['"]+/g, '');
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
  
export default ensureAuth;
