/*
TEACHER API:
    - This API serve the request of 'api/teacher/'
*/

const express = require('express');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);


module.exports = router;