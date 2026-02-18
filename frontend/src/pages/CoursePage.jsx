import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import '../styles/course.css';

const CoursePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [activeSection, setActiveSection] = useState('assignments');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Assignment form state
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [aTitle, setATitle] = useState('');
    const [aDesc, setADesc] = useState('');
    const [aDueDate, setADueDate] = useState('');

    // Material form state
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [mFile, setMFile] = useState(null);
    const [mLink, setMLink] = useState('');

    const fetchCourse = async () => {
        try {
            const res = await api(`/courses/${id}`);
            setCourse(res.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await api(`/assignments/course/${id}`);
            setAssignments(res.data);
        } catch (err) {
            console.error('Assignments:', err.message);
        }
    };

    const fetchMaterials = async () => {
        try {
            const res = await api(`/materials/course/${id}`);
            setMaterials(res.data);
        } catch (err) {
            console.error('Materials:', err.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchCourse();
            await fetchAssignments();
            await fetchMaterials();
            setLoading(false);
        };
        loadData();
    }, [id]);

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api('/assignments', {
                method: 'POST',
                body: JSON.stringify({
                    course_id: id,
                    title: aTitle,
                    description: aDesc,
                    due_date: aDueDate
                })
            });
            setATitle('');
            setADesc('');
            setADueDate('');
            setShowAssignmentForm(false);
            fetchAssignments();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUploadMaterial = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const formData = new FormData();
            formData.append('course_id', id);
            if (mFile) {
                formData.append('file', mFile);
            }
            if (mLink) {
                formData.append('link', mLink);
            }

            await api('/materials', {
                method: 'POST',
                body: formData
            });
            setMFile(null);
            setMLink('');
            setShowMaterialForm(false);
            fetchMaterials();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Loading course...</div>;
    if (!course) return <div className="error-message">Course not found.</div>;

    const isInstructor = user?.role === 'instructor';

    return (
        <div className="course-page">
            <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

            <div className="course-detail-header">
                <div>
                    <h1>{course.title}</h1>
                    <p className="course-meta">Instructor: {course.instructor_name}</p>
                    {course.description && <p className="course-description">{course.description}</p>}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="course-tab-bar">
                <button
                    className={`tab-btn ${activeSection === 'assignments' ? 'active' : ''}`}
                    onClick={() => setActiveSection('assignments')}
                >
                    📝 Assignments ({assignments.length})
                </button>
                <button
                    className={`tab-btn ${activeSection === 'materials' ? 'active' : ''}`}
                    onClick={() => setActiveSection('materials')}
                >
                    📁 Materials ({materials.length})
                </button>
            </div>

            {/* ASSIGNMENTS SECTION */}
            {activeSection === 'assignments' && (
                <div className="course-section">
                    {isInstructor && (
                        <button
                            className="btn-primary btn-small"
                            onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                        >
                            {showAssignmentForm ? '✕ Cancel' : '+ Post Assignment'}
                        </button>
                    )}

                    {showAssignmentForm && (
                        <div className="create-form-card">
                            <h3>Post New Assignment</h3>
                            <form onSubmit={handleCreateAssignment}>
                                <div className="form-group">
                                    <label htmlFor="a-title">Title</label>
                                    <input
                                        id="a-title"
                                        type="text"
                                        value={aTitle}
                                        onChange={(e) => setATitle(e.target.value)}
                                        placeholder="Assignment title"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="a-desc">Description</label>
                                    <textarea
                                        id="a-desc"
                                        value={aDesc}
                                        onChange={(e) => setADesc(e.target.value)}
                                        placeholder="Assignment description..."
                                        rows={3}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="a-due">Due Date</label>
                                    <input
                                        id="a-due"
                                        type="date"
                                        value={aDueDate}
                                        onChange={(e) => setADueDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn-primary">Post Assignment</button>
                            </form>
                        </div>
                    )}

                    {assignments.length === 0 ? (
                        <div className="empty-state">
                            <p>📝 No assignments posted yet.</p>
                        </div>
                    ) : (
                        <div className="items-list">
                            {assignments.map((a) => (
                                <div key={a.id} className="item-card assignment-item">
                                    <div className="item-header">
                                        <h3>{a.title}</h3>
                                        <span className={`due-badge ${new Date(a.due_date) < new Date() ? 'overdue' : ''}`}>
                                            Due: {new Date(a.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {a.description && <p className="item-desc">{a.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* MATERIALS SECTION */}
            {activeSection === 'materials' && (
                <div className="course-section">
                    {isInstructor && (
                        <button
                            className="btn-primary btn-small"
                            onClick={() => setShowMaterialForm(!showMaterialForm)}
                        >
                            {showMaterialForm ? '✕ Cancel' : '+ Upload Material'}
                        </button>
                    )}

                    {showMaterialForm && (
                        <div className="create-form-card">
                            <h3>Upload Course Material</h3>
                            <form onSubmit={handleUploadMaterial}>
                                <div className="form-group">
                                    <label htmlFor="m-file">Upload PDF File</label>
                                    <input
                                        id="m-file"
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setMFile(e.target.files[0])}
                                    />
                                    <small className="form-hint">Only PDF files allowed, max 10MB</small>
                                </div>
                                <div className="form-divider">— OR —</div>
                                <div className="form-group">
                                    <label htmlFor="m-link">External Link</label>
                                    <input
                                        id="m-link"
                                        type="url"
                                        value={mLink}
                                        onChange={(e) => setMLink(e.target.value)}
                                        placeholder="https://example.com/resource"
                                    />
                                </div>
                                <button type="submit" className="btn-primary">Upload</button>
                            </form>
                        </div>
                    )}

                    {materials.length === 0 ? (
                        <div className="empty-state">
                            <p>📁 No materials uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="items-list">
                            {materials.map((m) => (
                                <div key={m.id} className="item-card material-item">
                                    <div className="item-header">
                                        <h3>{m.file_name || 'External Link'}</h3>
                                        <div className="material-actions">
                                            {m.file_path && (
                                                <a
                                                    href={`http://localhost:5000${m.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-download"
                                                >
                                                    📥 Download PDF
                                                </a>
                                            )}
                                            {m.external_link && (
                                                <a
                                                    href={m.external_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn-link"
                                                >
                                                    🔗 Open Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <p className="item-meta">
                                        Added {new Date(m.upload_date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CoursePage;
