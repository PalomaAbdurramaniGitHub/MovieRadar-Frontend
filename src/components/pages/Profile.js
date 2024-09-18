import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';
import defaultProfilePhoto from "../../images/profile-photo.png";
import Settings from "../../images/settings.png";

const Profile = () => {
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem('token')?.replace(/"/g, '');
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
                console.log('Fetched profile data:', data);
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
    
        fetchProfile();
    }, []);
    
    // if (!profile) {
    //     return <div>Loading...</div>;
    // }

    const handleEditProfile = () => {
        navigate('/editProfile');
    };

    return (
        <div className="container profile-container my-5">
            <div className='first-row'>
                <Link className="back-home btn btn-secondary ml-2" to="/">Back to Home</Link>

                <div className="dropdown">
                    <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img className='settings-image' src={Settings} alt="Settings" />
                    </button>
                    <ul className="dropdown-menu">
                        <li><Link className='dropdown-elements' to="/changeEmailAddress">Change Email</Link></li>
                        <li><Link className='dropdown-elements' to="/changePassword">Change Password</Link></li>
                        <li><Link className='dropdown-elements delete-link' to="/deleteAccount">Delete Account</Link></li>
                    </ul>
                </div>
            </div>
            <div className='profile-intro'>
                <img
                    src={profile.profilePhoto ? `http://localhost:3000/${profile.profilePhoto}` : defaultProfilePhoto}
                    alt="Profile"
                    className="profile-photo"
                />
                <div className='profile-intro-details'>
                    <div className='name-email'>
                        <h1 className='profile-name'>{profile.name}</h1>
                        <p>{profile.email}</p>
                    </div>
                    <p>{profile.bio}</p>
                </div>
            </div>
            <div className="profile-details">
                <p><strong>Birthday: </strong>{new Date(profile.birthdate).toLocaleDateString()}</p>
                <p><strong>Gender: </strong> {profile.gender || 'Not specified'}</p>
                <p><strong>Location: </strong> {profile.location || 'Not specified'}</p>
                <p><strong>Preferred Theme: </strong> {profile.themePreferences || 'Not specified'}</p>
                <p className='movie-preferences-text'><strong>Movie Preferences</strong></p>
                <div className='movie-preferences'>
                    <p><strong>Genre Preferences: </strong> {profile.preferences?.genres?.length ? profile.preferences.genres.join(', ') : 'None'}</p>
                    <p><strong>Theme Preferences: </strong> {profile.preferences?.themes?.length ? profile.preferences.themes.join(', ') : 'None'}</p>
                    <p><strong>Language Preferences: </strong> {profile.preferences?.languages?.length ? profile.preferences.languages.join(', ') : 'None'}</p>
                    <p><strong>Countries of Origin: </strong> {profile.preferences?.countriesOfOrigin?.length ? profile.preferences.countriesOfOrigin.join(', ') : 'None'}</p>
                    <p><strong>Minimum Rating: </strong> {profile.preferences?.minRating || 'Not specified'}</p>
                </div>
                <p><strong>Profile created on: </strong>{new Date(profile.createdAt).toLocaleDateString()}</p>
                <p><strong>Last modified on: </strong>{new Date(profile.lastModified).toLocaleDateString()}</p>
                <div className='buttons'>
                    <button className="edit-button" onClick={handleEditProfile}>Edit Profile</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;