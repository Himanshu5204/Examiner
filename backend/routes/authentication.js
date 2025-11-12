const express = require('express');
const { signup, login, getUser, sendCode, verify, resetPassword } = require('../controller/auth');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');

//common routes for all roles
router.post('/signup', signup);
router.post('/login', login);
router.post("/forgot-password", sendCode);
router.post("/verify", verify);
router.post("/reset-password", resetPassword);

//check user validity with token
router.get('/getUser', fetchuser, getUser);

module.exports = router;