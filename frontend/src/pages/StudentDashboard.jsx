import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../styles/dashboard.css';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [activeTab, setActiveTab] = useState('enrolled');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [allRes, enrolledRes] = await Promise.all([
                api('/courses'),
                api('/enrollments/my')
            ]);
            setAllCourses(allRes.data);
            setEnrolledCourses(enrolledRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEnroll = async (courseId) => {
        setError('');
        setSuccessMsg('');
        try {
            await api('/enrollments', {
                method: 'POST',
                body: JSON.stringify({ course_id: courseId })
            });
            setSuccessMsg('Enrolled successfully!');
            fetchData();
        } catch (err) {
            setError(err.message);
        }
    };

    const enrolledIds = enrolledCourses.map((c) => c.id);
    const availableCourses = allCourses.filter((c) => !enrolledIds.includes(c.id));

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}

            <div className="tab-bar">
                <button
                    className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('enrolled')}
                >
                    My Courses ({enrolledCourses.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
                    onClick={() => setActiveTab('browse')}
                >
                    Browse Courses ({availableCourses.length})
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading courses...</div>
            ) : activeTab === 'enrolled' ? (
                enrolledCourses.length === 0 ? (
                    <div className="empty-state">
                        <p>📚 You're not enrolled in any courses yet.</p>
                        <p>Go to "Browse Courses" to find and enroll in courses!</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {enrolledCourses.map((course) => (
                            <div
                                key={course.id}
                                className="course-card student-card"
                                onClick={() => navigate(`/course/${course.id}`)}
                            >
                                <div className="course-card-header">
                                    <h3>{course.title}</h3>
                                    <span className="enrolled-badge">Enrolled</span>
                                </div>
                                <p className="course-card-desc">{course.description || 'No description'}</p>
                                <div className="course-card-footer">
                                    <span className="course-instructor">By {course.instructor_name}</span>
                                    <span className="course-action">View →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                availableCourses.length === 0 ? (
                    <div className="empty-state">
                        <p>🎉 You're enrolled in all available courses!</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {availableCourses.map((course) => (
                            <div key={course.id} className="course-card browse-card">
                                <div className="course-card-header">
                                    <h3>{course.title}</h3>
                                </div>
                                <p className="course-card-desc">{course.description || 'No description'}</p>
                                <div className="course-card-footer">
                                    <span className="course-instructor">By {course.instructor_name}</span>
                                    <button
                                        className="btn-enroll"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEnroll(course.id);
                                        }}
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default StudentDashboard;
