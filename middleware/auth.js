const jwt = require('jsonwebtoken');
require('dotenv').config();
const Cookies = require('universal-cookie');

const Auth = {
  verifyToken(req, res, next) {

    const cookies = new Cookies(req.headers.cookie);
    // const token = cookies.get('token')

    const token = req.body.token

    console.log(token)
    if (token) {
      try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.verified = verified.id;
        console.log(verified);
        console.log('Successfully Verified');
        return next();
      } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(403).send({ message: 'Invalid token, please login again' });
      }
    } else {
      res.status(403).send({ message: 'You are not authenticated, please login first' });
    }
  }
}

module.exports = Auth;
