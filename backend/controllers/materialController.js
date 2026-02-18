const path = require('path');
const multer = require('multer');
const pool = require('../db');

// Multer config: save to /uploads, PDF only, 10MB max
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

const uploadMaterial = async (req, res) => {
    try {
        const { course_id, link } = req.body;

        if (!course_id) {
            return res.status(400).json({ success: false, message: 'course_id is required.' });
        }

        // Verify instructor owns this course
        const [courses] = await pool.query(
            'SELECT id FROM courses WHERE id = ? AND instructor_id = ?',
            [course_id, req.user.id]
        );
        if (courses.length === 0) {
            return res.status(403).json({ success: false, message: 'You can only upload materials to your own courses.' });
        }

        let file_name = null;
        let file_path = null;

        if (req.file) {
            file_name = req.file.originalname;
            file_path = '/uploads/' + req.file.filename;
        }

        if (!file_path && !link) {
            return res.status(400).json({ success: false, message: 'Either a PDF file or a link is required.' });
        }

        const [result] = await pool.query(
            'INSERT INTO materials (course_id, file_name, file_path, external_link) VALUES (?, ?, ?, ?)',
            [course_id, file_name, file_path, link || null]
        );

        res.status(201).json({
            success: true,
            message: 'Material uploaded successfully.',
            data: { id: result.insertId, course_id, file_name, file_path, external_link: link || null }
        });
    } catch (err) {
        console.error('Upload material error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getMaterialsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Check access: instructor who owns course OR enrolled student
        if (req.user.role.toLowerCase() === 'student') {
            const [enrollment] = await pool.query(
                'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
                [req.user.id, courseId]
            );
            if (enrollment.length === 0) {
                return res.status(403).json({ success: false, message: 'You must be enrolled in this course to view materials.' });
            }
        } else if (req.user.role.toLowerCase() === 'instructor') {
            const [course] = await pool.query(
                'SELECT id FROM courses WHERE id = ? AND instructor_id = ?',
                [courseId, req.user.id]
            );
            if (course.length === 0) {
                return res.status(403).json({ success: false, message: 'You can only view materials of your own courses.' });
            }
        }

        const [materials] = await pool.query(
            'SELECT * FROM materials WHERE course_id = ? ORDER BY upload_date DESC',
            [courseId]
        );

        res.json({ success: true, data: materials });
    } catch (err) {
        console.error('Get materials error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { upload, uploadMaterial, getMaterialsByCourse };
