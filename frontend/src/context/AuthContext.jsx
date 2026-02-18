import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            const parsed = JSON.parse(savedUser);
            parsed.role = parsed.role.toLowerCase();
            setUser(parsed);
        }
        setLoading(false);
    }, []);

    const login = (userData, tokenStr) => {
        const normalizedUser = { ...userData, role: userData.role.toLowerCase() };
        setUser(normalizedUser);
        setToken(tokenStr);
        localStorage.setItem('token', tokenStr);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    if (loading) return null;

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
