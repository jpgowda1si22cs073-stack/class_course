const pool = require('../db');

const createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Course title is required.' });
        }

        const [result] = await pool.query(
            'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)',
            [title, description || '', req.user.id]
        );

        res.status(201).json({
            success: true,
            message: 'Course created successfully.',
            data: { id: result.insertId, title, description, instructor_id: req.user.id }
        });
    } catch (err) {
        console.error('Create course error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT c.*, u.name AS instructor_name 
       FROM courses c 
       JOIN users u ON c.instructor_id = u.id 
       ORDER BY c.created_at DESC`
        );

        res.json({ success: true, data: courses });
    } catch (err) {
        console.error('Get courses error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getCourseById = async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT c.*, u.name AS instructor_name 
       FROM courses c 
       JOIN users u ON c.instructor_id = u.id 
       WHERE c.id = ?`,
            [req.params.id]
        );

        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }

        res.json({ success: true, data: courses[0] });
    } catch (err) {
        console.error('Get course error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getInstructorCourses = async (req, res) => {
    try {
        const [courses] = await pool.query(
            `SELECT c.*, u.name AS instructor_name 
       FROM courses c 
       JOIN users u ON c.instructor_id = u.id 
       WHERE c.instructor_id = ? 
       ORDER BY c.created_at DESC`,
            [req.user.id]
        );

        res.json({ success: true, data: courses });
    } catch (err) {
        console.error('Get instructor courses error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = { createCourse, getAllCourses, getCourseById, getInstructorCourses };
