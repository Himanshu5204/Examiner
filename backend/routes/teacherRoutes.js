/*
TEACHER API:
    - This API serve the request of 'api/teacher/'
*/

const express = require('express');
const { signup, login } = require('../controller/auth');
const router = express.Router();

//router.post('/signup', signup);
//router.post('/login', login);


module.exports = router;