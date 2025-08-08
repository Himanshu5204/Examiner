const jwt = require('jsonwebtoken');
const getSchema = require('../utils/getSchema');
const JWT_SECRET = 'Himanshu@123';

//This middleware allows user(student, admin, teacher) to identify by just token
const fetchuser = async (req, res, next) => {
  console.log("===========================fetchuser===========================")
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Token Not found");
    return res.status(401).json({ error: 'No token provided' });
  }
  console.log("Token found");

  //Extract token from header
  //0th index is Beared
  //1st index is token
  const token = authHeader.split(' ')[1];
  console.log("Received token:", token);

  try {

    //Decoding data with secrate key
    const decoded = jwt.verify(token, JWT_SECRET);

    //This includes _id, email, role
    console.log("Decoded data:", decoded);

    /*
      -> Find email/_id exist in particular model then user is authenticate 
    */

    //Get the correct model based on role in token
    // console.log(req.query.role);
    console.log(decoded.role);
    const model = getSchema[decoded.role];
    if (!model) {
      console.log("Invalid role");
      return res.status(400).json({ error: 'Invalid role' });
    }
    console.log("valid role");

    //retrive user data from model without password
    const user = await model.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    console.log("User found")

    user.role = decoded.role;
    req.user = user; // Attach user to request
    req.role = decoded.role;

    console.log("REQ: ", req.user);
    console.log("ROLE: ", req.role);
    next(); //getUser()
  } catch (error) {

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.log("===========================endfetchuser===========================")
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = fetchuser;