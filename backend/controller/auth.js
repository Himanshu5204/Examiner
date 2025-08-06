//IMPORTANT 'Status Code'
// 200 -> OK(request fullfilled)
// 201 -> Create new resources
// 204 -> User not found / user not exist on Database
// 400 => mistake from client/user side (missing values, incorrect data)
// 403 -> Invalid credentials
// 409 -> Resource already exist
// 500 -> Internal server error

// For api logic related to authentication

// use data of utils/createUser.js
// It uses utility functions to create users and get the appropriate database schema based on user roles.

// auth.js data validation and pass for api called from routes/authentication.js
// This file handles user signup and login functionalities

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Himanshu@123';
const bcrypt = require('bcrypt');

const {
  createAdmin,
  createStudent,
  createTeacher
} = require('../utils/createUser');
const fetchuser = require('../middleware/fetchuser');

/*
getSchema:
- is object mapping {"role":"databaseSchema"}
- easily accesible through 'utils'
*/
const getSchema = require('../utils/getSchema');




const login = async (req, res) => {
  const { role, email, password } = req.body;

  //change model role wise (student, teacher, admin)
  let model = getSchema[role];
  if (!model) {
    console.log('[ERROR] Invalid role', role);
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  try {
    //usernot found
    const user = await model.findOne({ email });
    if (!user) {
      res.status(204).json({ message: 'User not exists' });
      return;
    }

    //user password matching
    const passwordCompare = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordCompare);

    //password is wrong
    if (!passwordCompare) {
      res.status(403).json({ message: 'Unauthorized User' });
      return;
    }

    //generating token with (_id, role, email) for 1h
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, // payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Generated Token:', token);

    //return toke for storing inside client's browser
    res.status(200).json({ message: 'User Successfully login', token, user: user });

  } catch (error) {
    console.error('Error_Authentication_Login_User(' + role + '): ' + error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
};

// getUser controller: just return req.user (populated by fetchuser middleware)
const getUser = (req, res) => {

  //After calling middleware fetchUser
  //check user found while authenticate or not
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  //sendig data to frontend
  console.log('Fetched user:', req.user);
  res.status(200).json({ user: req.user });
};

/*
getFunction:
    - mapping of craete function according users
*/
const getFunction = {
  student: createStudent,
  teacher: createTeacher,
  admin: createAdmin
};

//token generated via jwt(_id, role, email) -> stored in localstorage
//This token used when user made request to backend.
//helps identify user is authenticate or not
const signup = async (req, res) => {

  const { role, email } = req.body;

  let model = getSchema[role];

  try {

    let user = await model.findOne({ email });


    //user found in database
    if (user) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }


    if (role == 'admin') {

      let alreadyExistAdmin = await model.find({});

      //admin exist -> not able to create another admin
      if (alreadyExistAdmin.length > 0) {
        res.status(409).json({ message: 'Admin should be One' });
        return;
      }
    }


    //This finction return promise to save user
    //await it then user will saved
    const signupUserFunction = getFunction[role];
    user = await signupUserFunction(req.body);

    //creating token while login
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, // payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User created succesfully', user, token });

  } catch (error) {

    // Duplicate key error (MongoDB unique index)
    if (error.code === 11000) {
      console.error("Duplicate_Entry_Error in MongoDB");
      return res.status(400).json({ message: 'ID or Email already exists' });
    }

    console.error('Error_Authentication_Signup_User(' + role + '): ' + error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
};

module.exports = { login, signup, getUser, fetchuser };