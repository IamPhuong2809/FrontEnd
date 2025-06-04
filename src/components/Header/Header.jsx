import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '@images/Logo_Horizon.png'; // Đảm bảo đường dẫn đúng
import defaultAvatar from '@images/default-avatar.png';
import { jwtDecode } from 'jwt-decode';

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
        setUser(null);
        setShowDropdown(false);
        navigate('/login');
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedUser = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decodedUser.exp > currentTime) {
                        setUser(decodedUser);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Token không hợp lệ:', error);
                    handleLogout();
                }
            }
            setIsLoading(false);
        };
        
        checkAuth();
    });

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
                <button className={`nav-item ${isControlMobile ? 'active' : ''}`} onClick={() => navigate('/ControlMobile/PowerMobile')}>MOBILE ROBOT</button>
                <button className={`nav-item ${is6Dof ? 'active' : ''}`} onClick={() => navigate('/6dof/PowerRobot')}>6DOF ROBOT</button>
                <button className={`nav-item ${isStateSystems ? 'active' : ''}`} onClick={() => navigate('/StateSystems')}>STATE SYSTEMS</button>
            {isLoading ? (
                    <div className="auth-placeholder"></div>
                ) : (
                    <div className="avatar-container">
                        <img 
                            src={user?.avatar || defaultAvatar} 
                            alt="User Avatar" 
                            className="user-avatar"
                            onClick={() => setShowDropdown(!showDropdown)} 
                        />
                        <div className="avatar-dropdown" style={{ display: showDropdown ? 'block' : 'none' }}>
                            <div className="user-info">
                                <span>{user?.name}</span>
                                <span>{user?.email}</span>
                            </div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                )}
            </ul>
        </header>
    );
}

export default Header;