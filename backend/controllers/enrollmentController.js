const pool = require('../db');

const enroll = async (req, res) => {
    try {
        const { course_id } = req.body;

        if (!course_id) {
            return res.status(400).json({ success: false, message: 'Course ID is required.' });
        }

        // Check if course exists
        const [courses] = await pool.query('SELECT id FROM courses WHERE id = ?', [course_id]);
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }

        // Check if already enrolled
        const [existing] = await pool.query(
            'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
            [req.user.id, course_id]
        );
        if (existing.length > 0) {
            return res.status(409).json({ success: false, message: 'Already enrolled in this course.' });
        }

        await pool.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [req.user.id, course_id]
        );

        res.status(201).json({ success: true, message: 'Enrolled successfully.' });
    } catch (err) {
        console.error('Enroll error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getMyEnrollments = async (req, res) => {
    try {
        const [enrollments] = await pool.query(
            `SELECT e.id AS enrollment_id, e.enrolled_at, c.*, u.name AS instructor_name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.instructor_id = u.id
       WHERE e.student_id = ?
       ORDER BY e.enrolled_at DESC`,
            [req.user.id]
        );

        res.json({ success: true, data: enrollments });
    } catch (err) {
        console.error('Get enrollments error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { enroll, getMyEnrollments };
