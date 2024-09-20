import React, { useState } from 'react';
import axios from 'axios';
import './ProfileEdit.css';
import { logout } from "../../helpers.js";
import { Link, useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
    const [text, setText] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token') || '""');
        
        if (!password) {
            alert('Please enter your password.');
            return;
        }
    
        try {
            await axios.delete('http://localhost:3000/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: { password }
            });
    
            logout(() => {
                navigate('/signup');
            });
        } catch (error) {
            console.error('Error deleting profile:', error.response ? error.response.data : error.message);
            setText('Something went wrong! Account not deleted.');
        }
    };    

    return (
        <div className="profile-edit-container my-5">
            <Link className="back-home btn btn-secondary ml-2" to="/profile">Back to Profile</Link>
            <div className="profile-edit-intro">
                <div>
                    <h1>Delete Account</h1>
                    <p>Are you sure you want to permanently delete your account? <br /> This action cannot be undone and all your data will be lost. Please enter your password to confirm the deletion.</p>
                </div>
            </div>
            <form className="profile-edit-form" onSubmit={handleDelete}>
                {text && <p>{text}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                <div className='buttons'>
                    <button className='submit-Button' type="submit">Delete Account</button>
                </div>
            </form>
        </div>
    );
};

export default DeleteAccount;