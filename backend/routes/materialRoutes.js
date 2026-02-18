const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { upload, uploadMaterial, getMaterialsByCourse } = require('../controllers/materialController');

router.post('/', verifyToken, requireRole('instructor'), (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            if (err.message === 'Only PDF files are allowed.') {
                return res.status(400).json({ success: false, message: err.message });
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size exceeds 10MB limit.' });
            }
            return res.status(500).json({ success: false, message: 'File upload error.' });
        }
        next();
    });
}, uploadMaterial);

router.get('/course/:courseId', verifyToken, getMaterialsByCourse);

module.exports = router;
