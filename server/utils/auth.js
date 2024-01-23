const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (context) {
    // allows the token to be sent via context.req.query or headers
    let token = context.req.query.token || context.req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (context.req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      // Return req or context.req here?
      return context.req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      context.user = data;
    } catch (error) {
      console.log('Invalid token:', error.message);
      throw new AuthenticationError('Invalid token!');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
