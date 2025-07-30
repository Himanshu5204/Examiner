const express = require('express');
const { signup, login,getUser } = require('../controller/auth');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');

//common routes for all roles

router.post('/signup', signup)
router.post('/login', login);
router.get('/getUser', fetchuser,getUser);

module.exports = router;