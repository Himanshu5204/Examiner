//IMPORTANT 'Status Code'
// 200 -> OK(request fullfilled)
// 201 -> Create new resources
// 204 -> User not found / user not exist on Database
// 400 => mistake from client/user side (missing values, incorrect data)
// 403 -> Invalid credentials
// 409 -> Resource already exist
// 500 -> Internal server error

/*
* This file contains:
* signup:
*   - (Admin) Should be one in entire college:
*   - (Teacher) eligible if exists TeacherList's:
*   - (Student) eligible if exists StudentList's:
* signup:
*   - (user) should have token or email&password to login
*/

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Himanshu@123';
const bcrypt = require('bcrypt');
const {
  createAdmin,
  createStudent,
  createTeacher
} = require('../utils/createUser');
const fetchuser = require('../middleware/fetchuser');

/*(utility object)
* getSchema:
*  - is object mapping {"role":"databaseSchema"}
*  - easily accesible through 'utils'
*/
const getSchema = require('../utils/getSchema');


// =========================Log in===================================
const login = async (req, res) => {
  console.log("=====================login=============================")
  const { role, email, password } = req.body;
  console.log(role + "=" + email);

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
      { id: user._id, role: role, email: user.email }, // payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );


    //Decoding data with secrate key
    const decoded = jwt.verify(token, JWT_SECRET);

    //This includes _id, email, role
    console.log("Decoded data:", decoded);

    console.log("OLD: ", user.token);
    console.log('NEW:', token);

    user.token = token;

    console.log(user);

    await model.updateOne({ _id: user._id }, { token: token });
    console.log("=====================endlogin=============================")
    //return toke for storing inside client's browser
    res.status(200).json({ message: 'User Successfully login', token, user: user });

  } catch (error) {
    console.error('Error_Authentication_Login_User(' + role + '): ' + error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
};



// =========================Token Auth===================================
// getUser controller: just return req.user (populated by fetchuser middleware)
const getUser = (req, res) => {

  //After calling middleware fetchUser
  //check user found while authenticate or not
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  console.log("====================getUser=======================")
  console.log(req.user);
  console.log("====================endgetUser=======================")
  // req.user.role = req.role;
  //sendig data to frontend
  console.log('Fetched user:', req.user, req.role);
  res.status(200).json({ user: req.user, role: req.role });
};

/*(utility function)
*  getFunction:
*   - mapping of craete function according users
*/
const getFunction = {
  student: createStudent,
  teacher: createTeacher,
  admin: createAdmin
};



// =========================Sign Up===================================
/*
* token generated via jwt(_id, role, email) -> stored in localstorage/cookie
* This token used when user made request to backend.
* helps identify user is authenticate or not
*/
const signup = async (req, res) => {
  console.log("=====================signup=============================")
  const { role, email } = req.body;

  let model = getSchema[role];

  try {

    let user = await model.findOne({ email });

    //user found in database
    if (user) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    //Admin should be one in entire college
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

    //contains {status, user}
    const response = await signupUserFunction(req.body);


    //if teacher/student loggined then other teacher/student use these mail is not allowed
    if (response.status == 403) {
      return res.status(403).json({ message: `${role} is already loggedin` });

    }

    //if teacher/student mail not found in lists
    else if (response.status == 204) {
      return res.status(403).json({ message: `${role} email is not found` });
    }

    //Error is something else
    else if (response.status == 500) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    user = response.user;

    //creating token while login
    const token = jwt.sign(
      { id: user._id, role: role, email: user.email }, // payload
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    //Decoding data with secrate key
    const decoded = jwt.verify(token, JWT_SECRET);

    //This includes _id, email, role
    console.log("Decoded data:", decoded);

    //saving new token to user
    user.token = token;

    await user.save();
    console.log("=====================endsignup=============================")
    res.status(201).json({ message: 'User created succesfully', user });

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

/*
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'jointomeet.com@gmail.com',
    pass: "@Aryan1509"
  }
});


async function mailer(recieverEmail, varificationCode) {
  const info = await transporter.sendMail({
    from: 'JOiNTOMEET',
    to: recieverEmail,
    subject: "Authentication",
    text: `Hello User`,
    html: `Your OTP code is <b>${varificationCode}</b>`,
  });

  console.log("varification code send");
  console.log("Message sent: %s", info.messageId);
}


async function mailer2(name, recieverEmail, varificationCode) {
  const info = await transporter.sendMail({
    from: 'JOiNTOMEET',
    to: recieverEmail,
    subject: "Authentication",
    text: `Hello ${name}`,
    html: `Your Varification code is <b>${varificationCode}</b>`,
  });

  console.log("varification code send");
  console.log("Message sent: %s", info.messageId);
}
*/
const nodemailer = require("nodemailer");
let otpStore = {};


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'jointomeet.com@gmail.com',
    pass: "xtpj rgas sqnm iysw"
  }
});


async function mailer(recieverEmail, varificationCode) {
  const info = await transporter.sendMail({
    from: 'JOiNTOMEET',
    to: recieverEmail,
    subject: "Authentication",
    text: `Hello User`,
    html: `Your OTP code is <b>${varificationCode}</b>`,
  });

  console.log("varification code send");
  console.log("Message sent: %s", info.messageId);
}
/*
/     user: 'jointomeet.com@gmail.com',
/     pass: "@Aryan1509Nayak"
*/

const sendCode = async (req, res) => {
  const { email, role } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit code
  otpStore[email] = otp;
  console.log(otpStore);
  try {
    await mailer(email, otp);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
}

const verify = async (req, res) => {
  const { email, otp } = req.body;
  console.log(otpStore);
  if (otpStore[email] && otpStore[email].toString() === otp.toString()) {
    delete otpStore[email]; // clear after success
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
}

const resetPassword = async (req, res) => {
  const { role, email, password } = req.body;
  console.log(role, email, password);

  if (!role || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }
  try {
    const model = getSchema[role];
    if (!model) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    console.log("found role");

    const user = await model.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    console.log("found user");

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    await model.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = { login, signup, getUser, fetchuser, sendCode, verify, resetPassword };