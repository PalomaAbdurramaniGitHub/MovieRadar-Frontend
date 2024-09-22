import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileEdit.css';
import { Link, useNavigate } from "react-router-dom";

const ChangeEmailAddress = () => {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState({});
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = JSON.parse(localStorage.getItem('token') || '""');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setProfile(data);
                setEmail(data.email);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token') || '""');
        try {
            const verifyResponse = await axios.put('http://localhost:3000/api/users/changeEmail', {
                password: password,
                newEmail: email
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (verifyResponse.status === 200) {
                setIsCodeSent(true);
                setText('A verification code has been sent to your new email.');
            } else {
                setText('Something went wrong!');
            }
        } catch (error) {
            console.error('Error during email change:', error.response ? error.response.data : error.message);
            setText('Check your credentials.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token') || '""');
        try {
            const verifyCodeResponse = await axios.put('http://localhost:3000/api/users/verify-email-code', {
                verificationCode: verificationCode
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (verifyCodeResponse.status === 200) {
                navigate('/profile');
                setText('Email address successfully updated.');
            } else {
                setText('Invalid or expired verification code.');
            }
        } catch (error) {
            console.error('Error during verification:', error.response ? error.response.data : error.message);
            setText('Verification failed.');
        }
    };

    return (
        <div className="profile-edit-container my-5">
            <Link className="back-home btn btn-secondary ml-2" to="/profile">Back to Profile</Link>
            <div className="profile-edit-intro">
                <div>
                    <h1>Change Your Email Address</h1>
                    <p>
                        {isCodeSent
                            ? 'Enter the 6-digit verification code sent to your new email.'
                            : 'To update your email address, please enter your current password and the new email address you\'d like to use.'}
                    </p>
                </div>
            </div>

            {text && <p>{text}</p>}

            {!isCodeSent ? (
                <form className="profile-edit-form" onSubmit={handleSubmit}>
                    <div className="signup-field">
                        <div className="field-container">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="signup-field">
                        <div className="field-container">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button className="submit-Button" type="submit">Send Verification Code</button>
                </form>
            ) : (
                <form className="profile-edit-form my-4" onSubmit={handleVerifyCode}>
                    <div className="signup-field">
                        <div className="field-container">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button className="submit-Button" type="submit">Verify Code</button>
                </form>
            )}
        </div>
    );
};

export default ChangeEmailAddress;