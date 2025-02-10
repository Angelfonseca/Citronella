require('dotenv').config()
const jwt = require('jwt-simple')
const moment = require('moment')
const secret = process.env.SECRET_JWT || ''

const createToken = (obj) => {
  let payload = {
    id: obj.id,
    username: obj.username,
    iat: moment().unix(),
    exp: moment().add(2, 'hours').unix()
  }
  return jwt.encode(payload, secret)
}

const jwtMethods = {
  createToken
}

module.exports = jwtMethods