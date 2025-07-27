const jwt = require('jsonwebtoken');
const getSchema = require('../utils/getSchema');
const JWT_SECRET = 'Himanshu@123';

const fetchuser = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  console.log("Received token:", token);
  

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded data:", decoded);
    // Get the correct model based on role in token
    const model = getSchema[decoded.role];
    if (!model) return res.status(400).json({ error: 'Invalid role' });
    const user = await model.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    req.user = user; // Attach user to request
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = fetchuser;