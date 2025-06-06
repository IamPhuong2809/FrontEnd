import React, { useState, useRef } from 'react';
import './Login.css'; // Nếu có CSS riêng
import Logo_Horizon from '@images/Logo_Horizon.png';
import Logo_UTE from '@images/Logo_UTE.png';
import Logo_ACIS from '@images/Logo_ACIS.png';
import Robot from '@images/WebServer_Login_Image.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const url = "http://127.0.0.1:8000/api/"

const Login = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        try {
            const response = await fetch(url + 'login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            if (data.message === 'success') {
                toast.success('Login successfully!');
                localStorage.setItem("token", data.token);
                localStorage.setItem("fullname", data.fullname);
                localStorage.setItem("gmail", data.gmail);
                navigate('/');
            } else {
                toast.error(data.message || "Login failed: No token received");
            }
            
        } catch (error) {
            console.error('Login error:', error);
            toast.error(`${error}`);
        }
    };

    return (
        <div className="login-page">
            <div className="logo-container">
                <img src={Logo_UTE} alt="Logo" className="logo-small" />
                <img src={Logo_ACIS} alt="Logo" className="logo-small second" />
            </div>
            <div className="container">
                <div className="form-container sign-in-container">
                    <form ref={formRef} onSubmit={handleSubmit}>
                        <div className="header-form">
                            <img src={Logo_Horizon} alt="Logo" className="logo" />
                            <h1>Sign in</h1>
                        </div>
                        <div className="form-control">
                            <input 
                                type="text" 
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="" 
                                autoComplete="off"
                            />
                            <label>Username</label>
                        </div>
                        <div className="form-control">
                            <input 
                                type="password" 
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=""
                                autoComplete="new-password"
                            />
                            <label>Password</label>
                        </div>

                        <a href="#">Forgot your password?</a>
                        <button type="button" onClick={handleSubmit}>Sign In</button>
                    </form>
                </div>
                <div className="overlay-container">
                    <img src={Robot} alt="Robot" className="robot" />
                </div>
            </div>
        </div>
    );
};

export default Login;
