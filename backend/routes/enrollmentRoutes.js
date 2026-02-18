const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { enroll, getMyEnrollments } = require('../controllers/enrollmentController');

router.post('/', verifyToken, requireRole('student'), enroll);
router.get('/my', verifyToken, requireRole('student'), getMyEnrollments);

module.exports = router;
