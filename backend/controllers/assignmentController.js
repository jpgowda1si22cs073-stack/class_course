const pool = require('../db');

const createAssignment = async (req, res) => {
    try {
        const { course_id, title, description, due_date } = req.body;

        if (!course_id || !title || !due_date) {
            return res.status(400).json({ success: false, message: 'course_id, title, and due_date are required.' });
        }

        // Verify instructor owns this course
        const [courses] = await pool.query(
            'SELECT id FROM courses WHERE id = ? AND instructor_id = ?',
            [course_id, req.user.id]
        );
        if (courses.length === 0) {
            return res.status(403).json({ success: false, message: 'You can only post assignments to your own courses.' });
        }

        const [result] = await pool.query(
            'INSERT INTO assignments (course_id, title, description, due_date) VALUES (?, ?, ?, ?)',
            [course_id, title, description || '', due_date]
        );

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully.',
            data: { id: result.insertId, course_id, title, description, due_date }
        });
    } catch (err) {
        console.error('Create assignment error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getAssignmentsByCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;

        // Check access: instructor who owns the course OR enrolled student
        if (req.user.role.toLowerCase() === 'student') {
            const [enrollment] = await pool.query(
                'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
                [req.user.id, courseId]
            );
            if (enrollment.length === 0) {
                return res.status(403).json({ success: false, message: 'You must be enrolled in this course to view assignments.' });
            }
        } else if (req.user.role.toLowerCase() === 'instructor') {
            const [course] = await pool.query(
                'SELECT id FROM courses WHERE id = ? AND instructor_id = ?',
                [courseId, req.user.id]
            );
            if (course.length === 0) {
                return res.status(403).json({ success: false, message: 'You can only view assignments of your own courses.' });
            }
        }

        const [assignments] = await pool.query(
            'SELECT * FROM assignments WHERE course_id = ? ORDER BY due_date ASC',
            [courseId]
        );

        res.json({ success: true, data: assignments });
    } catch (err) {
        console.error('Get assignments error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { createAssignment, getAssignmentsByCourse };
