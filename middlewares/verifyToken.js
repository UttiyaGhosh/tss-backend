require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token']
    || req.headers['authorization']
    || req.session.token

  console.log(token)
  
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'A token is required for authentication'
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Add the decoded token to the request object
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  return next(); // Proceed to the next middleware or route handler
};



module.exports = verifyToken;