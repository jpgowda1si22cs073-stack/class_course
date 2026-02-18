import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">📚 ClassroomApp</Link>
            </div>
            <div className="navbar-links">
                {user.role === 'instructor' && (
                    <Link to="/instructor/dashboard">Dashboard</Link>
                )}
                {user.role === 'student' && (
                    <Link to="/student/dashboard">Dashboard</Link>
                )}
                <span className="navbar-user">
                    <span className="navbar-role">{user.role}</span>
                    {user.name}
                </span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
