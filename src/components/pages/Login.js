import React, { useState, useEffect } from 'react';
import "./Login.css";
import login from "../../images/login.jpg";
import MovieScreen from "../../images/movie-screen.jpg";
import { NavLink, useNavigate } from 'react-router-dom';
import { authenticate, getUser } from "../../helpers.js";

const LoginPage = () => {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (getUser()) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Successful login");
                authenticate(data, () => navigate('/'));
            } else {
                setText('Login failed!');
            }
        } catch (error) {
            console.error('Error:', error);
            setText('There was a problem with the login request.');
        }
    };

    return (
        <main className="login-page form-signin m-auto">
            <div className='login-components'>
                <div className='movieScreen-div'>
                    <img className='movie-screen' src={MovieScreen} alt="Movie Screen" />
                </div>
                <div className='form-div'>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <img className="logo" src={login} alt="Login Logo" />
                        <div className="login-text">
                            <h1>Login to your account</h1>
                            <p>Don't have an account? <NavLink className="signup-btn" to="/signup">Signup</NavLink></p>
                        </div>
                        <div className="login-field">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="login-field">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="login-btn btn w-100 py-2" type="submit">Continue</button>
                    </form>
                    {text && <p className="my-1">{text}</p>}
                </div>
            </div>
        </main>
    );
};

export default LoginPage;