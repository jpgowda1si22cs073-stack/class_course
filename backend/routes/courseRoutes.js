const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { createCourse, getAllCourses, getCourseById, getInstructorCourses } = require('../controllers/courseController');

router.post('/', verifyToken, requireRole('instructor'), createCourse);
router.get('/', verifyToken, getAllCourses);
router.get('/my', verifyToken, requireRole('instructor'), getInstructorCourses);
router.get('/:id', verifyToken, getCourseById);

module.exports = router;
