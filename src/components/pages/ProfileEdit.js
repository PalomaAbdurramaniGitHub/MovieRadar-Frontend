import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileEdit.css';
import { Link, useNavigate } from "react-router-dom";

const ProfileEdit = () => {
    const [textBio, setTextBio] = useState('');
    const [textRating, setTextRating] = useState('');
    const [photo, setPhoto] = useState(null);
    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        location: '',
        preferences: {
            genres: [],
            themes: [],
            languages: [],
            countriesOfOrigin: [],
            minRating: ''
        },
        gender: '',
        themePreferences: ''
    });

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
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'bio') {
            if (value.length > 200) {
                setTextBio('Bio exceeds 200 characters. Please shorten it.');
            } else {
                setTextBio('');
            }
        }

        if (name === 'preferences[minRating]') {
            const rating = Number(value);
            if (rating < 1 || rating > 10) {
                setTextRating('Rating must be between 1 and 10');
            } else {
                setTextRating('');
            }
        }

        if (name.startsWith('preferences')) {
            const [_, prefKey] = name.split('[');
            const cleanedKey = prefKey.replace(']', '');

            setProfile(prevProfile => ({
                ...prevProfile,
                preferences: {
                    ...prevProfile.preferences,
                    [cleanedKey]: cleanedKey === 'minRating' ? Number(value) : value.split(',').map(item => item.trim())
                }
            }));
        } else {
            setProfile(prevProfile => ({
                ...prevProfile,
                [name]: value
            }));
        }
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = JSON.parse(localStorage.getItem('token') || '""');

        const formData = new FormData();
        formData.append('name', profile.name);
        formData.append('bio', profile.bio);
        formData.append('location', profile.location);
        formData.append('preferences[genres]', profile.preferences.genres.join(', '));
        formData.append('preferences[themes]', profile.preferences.themes.join(', '));
        formData.append('preferences[languages]', profile.preferences.languages.join(', '));
        formData.append('preferences[countriesOfOrigin]', profile.preferences.countriesOfOrigin.join(', '));
        formData.append('preferences[minRating]', profile.preferences.minRating);
        formData.append('gender', profile.gender);
        formData.append('themePreferences', profile.themePreferences);
        if(photo){
            formData.append('photo', photo);
        }
        
        try {
            await axios.put('http://localhost:3000/api/users/me', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="profile-edit-container">
            <Link className="back-home btn btn-secondary ml-2" to="/profile">Back to Profile</Link>
            <div className="profile-edit-intro">
                <div>
                    <h1>Edit Profile</h1>
                </div>
            </div>
            <form className="profile-edit-form" encType="multipart/form-data">
                
                <div className='photo-section'>
                    <label htmlFor="photo">Profile Photo:</label>
                    <input
                        type="file"
                        name="photo"
                        id="photo"
                        onChange={handlePhotoChange} 
                    />
                </div>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        placeholder="Enter your name"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Bio:
                    <input
                        type="text"
                        name="bio"
                        value={profile.bio}
                        placeholder="Enter a short bio"
                        onChange={handleChange}
                    />
                </label>
                {textBio && <p>{textBio}</p>}
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={profile.location}
                        placeholder="Enter your location"
                        onChange={handleChange}
                    />
                </label>
                <label>Preferences</label>
                <div className='preferences'>
                    <label>
                        Genres (comma-separated):
                        <input
                            type="text"
                            name="preferences[genres]"
                            value={profile.preferences.genres.join(', ')}
                            placeholder="Enter genres"
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Themes (comma-separated):
                        <input
                            type="text"
                            name="preferences[themes]"
                            value={profile.preferences.themes.join(', ')}
                            placeholder="Enter themes"
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Languages (comma-separated):
                        <input
                            type="text"
                            name="preferences[languages]"
                            value={profile.preferences.languages.join(', ')}
                            placeholder="Enter languages"
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Countries of Origin (comma-separated):
                        <input
                            type="text"
                            name="preferences[countriesOfOrigin]"
                            value={profile.preferences.countriesOfOrigin.join(', ')}
                            placeholder="Enter countries of origin"
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Minimum Rating:
                        <input
                            type="number"
                            name="preferences[minRating]"
                            value={profile.preferences.minRating}
                            placeholder="Enter minimum rating"
                            min="1"
                            max="10"
                            onChange={handleChange}
                        />
                    </label>
                    {textRating && <p>{textRating}</p>}
                </div>
                <div className="signup-field radio-signup">
                    <div className="mb-3 radio-fields gender-field">
                        <label className='field-name'>Gender:</label>
                        <div className='radio-element-buttons'>
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    onChange={handleChange}
                                />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    onChange={handleChange}
                                />
                                <label htmlFor="female"> Female</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Not-defined"
                                    onChange={handleChange}
                                />
                                <label htmlFor="female"> Not-defined</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 radio-fields">
                        <label className='field-name'>Theme Preferences:</label>
                        <div className='radio-element-buttons'>
                            <div>
                                <input
                                    type="radio"
                                    name="themePreferences"
                                    value="Light"
                                    onChange={handleChange}
                                />
                                <label htmlFor="light">Light</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="themePreferences"
                                    value="Dark"
                                    onChange={handleChange}
                                />
                                <label htmlFor="dark">Dark</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    name="themePreferences"
                                    value="Default"
                                    onChange={handleChange}
                                />
                                <label htmlFor="dark">Default</label>
                            </div>
                        </div>
                    </div> 
                </div>
                <div className='buttons'>
                    <button className='submit-Button' onClick={handleSubmit}>Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEdit;