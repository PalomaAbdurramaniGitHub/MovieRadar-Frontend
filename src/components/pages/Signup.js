import React, { useState } from 'react';
import signup from "../../images/signup-logo.png";
import "./Signup.css";
import { NavLink, useNavigate } from 'react-router-dom';
import MovieScreen from "../../images/movie-screen.jpg";
import axios from 'axios';

const SignUpPage = () => {
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [secretCode, setSecretCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setText('Passwords do not match');
            return;
        }

        if (!name || !email || !password || !confirmPassword || !birthdate) {
            setText('Please fill in all required fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/users/signup', {
                name,
                email,
                password,
                confirmPassword,
                birthdate,
            }, {
                withCredentials: true
            });

            if (response.status === 201) {
                setCodeSent(true);
                setText("A verification code has been sent to your email.");
            } else {
                setText(response.data.message || 'Sign up failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            setText('There was a problem with the signup request.');
        }
    };

    const handleVerification = async (event) => {
        event.preventDefault();

        if (!secretCode) {
            setText('Please enter the verification code.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/users/verify-code', {
                email,
                verificationCode: secretCode,
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Verification successful");
                navigate('/login');
            } else {
                setText('Verification failed. Please check your code.');
            }
        } catch (error) {
            console.error('Error:', error);
            setText('There was a problem with the verification request.');
        }
    };

    return (
        <main className="signup-body">
            <div className='signup-components'>
                <div className='movieScreen-div'>
                    <img className='movie-screen' src={MovieScreen} alt="Movie Screen" />
                </div>
                <div>
                    {!codeSent ? (
                        <form className='signup-container' onSubmit={handleSignUp}>
                            <img id="signup-logo" src={signup} alt="Signup Logo" />
                            <div className='signup-title'>
                                <h1>Create a new account</h1>
                                <p>Already have an account? <NavLink className="login-link" to="/login">Login</NavLink></p>
                            </div>

                            <div className="signup-field">
                                <div className='field-container'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <span className="required-icon">*️</span>
                                </div>
                            </div>

                            <div className="signup-field">
                                <div className='field-container'>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <span className="required-icon">*️</span>
                                </div>
                            </div>

                            <div className="signup-field">
                                <div className='field-container'>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="required-icon">*️</span>
                                </div>
                            </div>

                            <div className="signup-field">
                                <div className='field-container'>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <span className="required-icon">*️</span>
                                </div>
                            </div>

                            <div className="signup-field">
                                <div className='field-container'>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={birthdate}
                                        onChange={(e) => setBirthdate(e.target.value)}
                                        required
                                    />
                                    <span className="required-icon">*️</span>
                                </div>
                            </div>

                            <button className="signup-here btn w-100 py-2" type="submit">Sign up</button>
                            {text && <p className="my-1">{text}</p>}
                        </form>
                    ) : (
                        <form className='signup-container my-5 py-3' onSubmit={handleVerification}>
                            <h1 className='my-5'>Enter Verification Code</h1>
                            <p>Check your email for a verification code.</p>

                            <div className="signup-field">
                                <div className='field-container'>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Verification Code"
                                        value={secretCode}
                                        onChange={(e) => setSecretCode(e.target.value)}
                                        required
                                    />
                                    <span className="required-icon">*️</span>
                                </div>
                            </div>

                            <button className="signup-here btn w-100 py-2" type="submit">Verify Code</button>
                            {text && <p className="my-1">{text}</p>}
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;