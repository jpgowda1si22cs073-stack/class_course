const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { createAssignment, getAssignmentsByCourse } = require('../controllers/assignmentController');

router.post('/', verifyToken, requireRole('instructor'), createAssignment);
router.get('/course/:courseId', verifyToken, getAssignmentsByCourse);

module.exports = router;
