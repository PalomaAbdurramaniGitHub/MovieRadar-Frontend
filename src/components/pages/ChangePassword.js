import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileEdit.css';
import { Link, useNavigate } from "react-router-dom";

const ChangePassword = () => {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = JSON.parse(sessionStorage.getItem('token') || '""');
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
        const token = JSON.parse(sessionStorage.getItem('token') || '""');
        try {
            const verifyResponse = await axios.put('http://localhost:3000/api/users/changePassword', {
                currentPassword: currentPassword,
                password: password,
                confirmPassword: confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (verifyResponse.status === 200) {
                navigate('/profile');
            } else {
                setText('Something went wrong!');
            }
        } catch (error) {
            console.error('Error during password change:', error.response ? error.response.data : error.message);
            setText('Check your credentials.');
        }
    };

    return (
        <div className="profile-edit-container">
            <Link className="back-home btn btn-secondary ml-2" to="/profile">Back to Profile</Link>
            <div className="profile-edit-intro">
                <div>
                    <h1>Change Your Password</h1>
                    <p>To update your password, please enter your current password, then choose a new password. Make sure your new password meets the security requirements.</p>
                </div>
            </div>
            <form className="profile-edit-form" onSubmit={handleSubmit}>
                {text && <p>{text}</p>}
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
                            id="floatingCurrentPassword"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
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
                            placeholder="New Password"
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
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span className="required-icon">*️</span>
                    </div>
                </div>
                <button className='submit-Button' type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ChangePassword;