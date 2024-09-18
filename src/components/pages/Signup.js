import React, { useState } from 'react';
import signup from "../../images/signup-logo.png";
import "./Signup.css";
import { NavLink } from 'react-router-dom';
import MovieScreen from "../../images/movie-screen.jpg";

const SignUpPage = () => {
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [birthdate, setBirthdate] = useState('');

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
            const response = await fetch('http://localhost:3000/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                    birthdate
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Registration successful");
                window.location.href = '/login';
            } else {
                setText('Sign up failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            setText('There was a problem with the sign up request.');
        }
    };

    return (
        <main className="signup-body">
            <div className='signup-components'>
                <div className='movieScreen-div'>
                        <img className='movie-screen' src={MovieScreen} alt="Movie Screen" />
                </div>
                <div>
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
                                    id="floatingName"
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
                                    id="floatingInput"
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
                                    id="floatingPassword"
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
                                    id="floatingConfirmPassword"
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
                                    id="floatingBirthdate"
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
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;