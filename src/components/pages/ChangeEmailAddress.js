import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileEdit.css';
import { Link, useNavigate } from "react-router-dom";

const ChangeEmailAddress = () => {
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState({});
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
                email: email
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
            console.error('Error during email change:', error.response ? error.response.data : error.message);
            setText('Check your credentials.');
        }
    };

    return (
        <div className="profile-edit-container my-5">
            <Link className="back-home btn btn-secondary ml-2" to="/profile">Back to Profile</Link>
            <div className="profile-edit-intro">
                <div>
                    <h1>Change Your Email Address</h1>
                    <p>To update your email address, please enter your current password and the new email address you'd like to use. </p>
                </div>
            </div>
            <form className="profile-edit-form" onSubmit={handleSubmit}>
                {text && <p>{text}</p>}
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
                    </div>
                </div>
                <button className='submit-Button' type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default ChangeEmailAddress;