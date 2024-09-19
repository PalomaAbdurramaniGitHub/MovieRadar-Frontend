import React, { useState, useEffect } from 'react';
import "./Login.css";
import login from "../../images/login.jpg";
import MovieScreen from "../../images/movie-screen.jpg";
import { NavLink, useNavigate } from 'react-router-dom';
import { authenticate, getUser } from "../../helpers.js";
import axios from "axios";

const LoginPage = () => {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (getUser()) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            console.log("here");
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Code sent to email");
                setCodeSent(true);
                setText('A secret code has been sent to your email.');
            } else {
                setText('Login failed!');
            }
        } catch (error) {
            console.error('Error:', error);
            setText('There was a problem with the login request.');
        }
    };

    const handleVerifyCode = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/verify-secret-code', {
                code: secretCode
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Successful login with secret code");
                authenticate(response.data, () => navigate('/'));
            } else {
                setText('Invalid secret code!');
            }
        } catch (error) {
            console.error('Error:', error);
            setText('There was a problem with the verification request.');
        }
    };

    return (
        <main className="login-page form-signin m-auto">
            <div className='login-components'>
                <div className='movieScreen-div'>
                    <img className='movie-screen' src={MovieScreen} alt="Movie Screen" />
                </div>
                <div className='form-div'>
                    {!codeSent ? (
                        <form className="login-form" onSubmit={handleLogin}>
                            <img className="logo" src={login} alt="Login Logo" />
                            <div className="login-text">
                                <h1>Login to your account</h1>
                                <p>Don't have an account? <NavLink className="signup-btn" to="/signup">Signup</NavLink></p>
                            </div>
                            <div className="login-field">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="login-field">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button className="login-btn btn w-100 py-2" type="submit">Continue</button>
                        </form>
                    ) : (
                        <form className="login-form" onSubmit={handleVerifyCode}>
                            <img className="logo" src={login} alt="Login Logo" />
                            <div className="login-text">
                                <h1>Enter the Secret Code</h1>
                                <p>A code has been sent to your email. Please enter it below to continue.</p>
                            </div>
                            <div className="login-field">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter secret code"
                                    value={secretCode}
                                    onChange={(e) => setSecretCode(e.target.value)}
                                />
                            </div>
                            <button className="login-btn btn w-100 py-2" type="submit">Verify Code</button>
                        </form>
                    )}
                    {text && <p className="my-1">{text}</p>}
                </div>
            </div>
        </main>
    );
};

export default LoginPage;