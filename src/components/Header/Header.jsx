import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '@images/Logo_Horizon.png'; // Đảm bảo đường dẫn đúng
import defaultAvatar from '@images/default-avatar.png';

function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const is6Dof = location.pathname.startsWith("/6dof");
    const isAssignTask = location.pathname.startsWith("/AssignTask");
    const isControlMobile = location.pathname.startsWith("/ControlMobile");
    const isStateSystems = location.pathname.startsWith("/StateSystems");

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token');
        localStorage.removeItem('gmail');
        localStorage.removeItem('fullname');
        setUser(null);
        setShowDropdown(false);
        navigate('/login');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const fullname = localStorage.getItem("fullname");
                    const gmail = localStorage.getItem("gmail");

                    setUser({
                        name: fullname, // hoặc decoded.name tùy vào cấu trúc token
                        email: gmail,
                    });
                } catch (error) {
                    console.error('Token không hợp lệ:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('gmail');
                    localStorage.removeItem('fullname');
                }
            }
            setIsLoading(false);
        };
        
        checkAuth();
    }, []);

    return (
        <header className="header">
            <div className="header-left">
                <Link to="/">
                    <div className="logo-container">
                        {isLoading ? (
                            <div className="logo-image-placeholder"></div>
                        ) : (
                            <img src={logo} alt="Logo" className="header-logo" />
                        )}
                        <span>HORIZON</span>
                    </div>
                </Link>
            </div>

            <ul className="nav-menu">
                <button className={`nav-item ${isAssignTask ? 'active' : ''}`} onClick={() => navigate('/AssignTask')}>ASSIGN TASKS</button>
                <button className={`nav-item ${isControlMobile ? 'active' : ''}`} onClick={() => navigate('/ControlMobile/Maps')}>MOBILE ROBOT</button>
                <button className={`nav-item ${is6Dof ? 'active' : ''}`} onClick={() => navigate('/6dof/PowerRobot')}>6DOF ROBOT</button>
                <button className={`nav-item ${isStateSystems ? 'active' : ''}`} onClick={() => navigate('/StateSystems')}>STATE SYSTEMS</button>
                {isLoading ? (
                    <div className="auth-placeholder"></div>
                ) : user ? (
                    <div className="avatar-container">
                        <img 
                            src={user?.avatar || defaultAvatar} 
                            alt="User Avatar" 
                            className="user-avatar"
                            onClick={() => setShowDropdown(!showDropdown)} 
                        />
                        <div className="avatar-dropdown" style={{ display: showDropdown ? 'block' : 'none' }}>
                            <div className="user-info">
                                <span>{user?.name || "N/A"}</span>
                                <span>{user?.email || "N/A"}</span>
                            </div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                )}
            </ul>
        </header>
    );
}

export default Header;