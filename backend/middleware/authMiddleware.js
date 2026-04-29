const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token') || 
                req.header('Authorization')?.split(' ')[1] ||
                req.query.token;
  
  if (!token) {
    console.log("Auth failed: No token found in headers or query. Query:", req.query);
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
