import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../styles/dashboard.css';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            const res = await api('/courses/my');
            setCourses(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await api('/courses', {
                method: 'POST',
                body: JSON.stringify({ title, description })
            });
            setTitle('');
            setDescription('');
            setShowForm(false);
            fetchCourses();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Instructor Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ New Course'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="create-form-card">
                    <h2>Create New Course</h2>
                    <form onSubmit={handleCreateCourse}>
                        <div className="form-group">
                            <label htmlFor="course-title">Course Title</label>
                            <input
                                id="course-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Introduction to Computer Science"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="course-desc">Description</label>
                            <textarea
                                id="course-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this course covers..."
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="btn-primary">Create Course</button>
                    </form>
                </div>
            )}

            <div className="section-title">
                <h2>Your Courses</h2>
                <span className="badge">{courses.length}</span>
            </div>

            {loading ? (
                <div className="loading">Loading courses...</div>
            ) : courses.length === 0 ? (
                <div className="empty-state">
                    <p>📖 You haven't created any courses yet.</p>
                    <p>Click "New Course" to get started!</p>
                </div>
            ) : (
                <div className="courses-grid">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="course-card instructor-card"
                            onClick={() => navigate(`/course/${course.id}`)}
                        >
                            <div className="course-card-header">
                                <h3>{course.title}</h3>
                            </div>
                            <p className="course-card-desc">{course.description || 'No description'}</p>
                            <div className="course-card-footer">
                                <span className="course-date">Created {new Date(course.created_at).toLocaleDateString()}</span>
                                <span className="course-action">Manage →</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorDashboard;
