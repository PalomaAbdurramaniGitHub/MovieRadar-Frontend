import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getUser } from "../../helpers";
import "./AddMovie.css";
import SearchIcon from "../../images/white-search-icon.png";
import AddIcon from "../../images/add-icon.png";

const AddMovie = () => {
    const { id } = useParams();
    const [actorText, setActorText] = useState('');
    const [directorText, setDirectorText] = useState('');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [poster, setPoster] = useState(null);
    const [movie, setMovie] = useState({
        title: "",
        year: "",
        directors: [],
        actors: [],
        languages: [],
        countriesOfOrigin: [],
        ageRestriction: "",
        contentAdvisory: {
            violence: false,
            vulgarLanguage: false,
            sexualContent: false,
            drugUse: false,
        },
        rating: "",
        genres: [],
        themes: [],
        duration: "",
        plot: "",
    });

    // States for searching and creating actors
    const [actorName, setActorName] = useState('');
    const [actors, setActors] = useState([]);
    const [noActorsFound, setNoActorsFound] = useState(false);
    const navigate = useNavigate();
    const user = getUser();
    const [newActor, setNewActor] = useState({ name: '', bio: '', birthdate: '', nationality: '', awards: [{ awardName: '', year: '' }] });

    // States for searching and creating directors
    const [directorName, setDirectorName] = useState('');
    const [directors, setDirectors] = useState([]);
    const [noDirectorsFound, setNoDirectorsFound] = useState(false);
    const [newDirector, setNewDirector] = useState({ name: '', bio: '', birthdate: '', nationality: '', awards: [{ awardName: '', year: '' }] });

    useEffect(() => {
        if (id) {
            const fetchMovieData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/movies/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${getAuthToken()}`
                        }
                    });
                    setMovie(response.data);
                } catch (error) {
                    console.error('Error fetching movie:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchMovieData();
        } else {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = JSON.parse(sessionStorage.getItem('token') || '""');
            if (!token) {
                console.error('No auth token found');
                setLoading(false);
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
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        if (!loading && profile && !profile.isAdmin) {
            navigate('/');
        }
        if (!user) {
            navigate('/');
        }
    }, [profile, loading, navigate, user]);

    // Helper function to get the token
    const getAuthToken = () => {
        return JSON.parse(sessionStorage.getItem('token') || '""');
    };

    // Search actors in the database
    const searchActors = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/actors/search`, {
                params: { name: actorName },
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (response.data.length > 0) {
                setActors(response.data);
                setNoActorsFound(false);
            } else {
                setActors([]);
                setNoActorsFound(true);
            }
        } catch (error) {
            console.error("Error searching actors:", error);
        }
    };

    // Search directors in the database
    const searchDirectors = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/directors/search`, {
                params: { name: directorName },
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (response.data.length > 0) {
                setDirectors(response.data);
                setNoDirectorsFound(false);
            } else {
                setDirectors([]);
                setNoDirectorsFound(true);
            }
        } catch (error) {
            console.error("Error searching directors:", error);
        }
    };

    // Create a new actor
    const createActor = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/actors', newActor, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            setMovie(prev => ({ ...prev, actors: [...prev.actors, response.data._id] }));
            setNewActor({ name: '', birthdate: '', bio: '', awards: [{ title: '', year: '' }] });
            setActorText(`Actor ${response.data.name} created and added to the movie.`);
        } catch (error) {
            console.error("Error creating actor:", error);
        }
    };

    // Create a new director
    const createDirector = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/directors', newDirector, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            setMovie(prev => ({ ...prev, directors: [...prev.directors, response.data._id] }));
            setNewDirector({ name: '', birthdate: '', bio: '', awards: [{ title: '', year: '' }] });
            setDirectorText(`Director ${response.data.name} created and added to the movie.`);
        } catch (error) {
            console.error("Error creating director:", error);
        }
    };

    // Handle movie detail changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setMovie(prev => ({
                ...prev,
                contentAdvisory: { ...prev.contentAdvisory, [name]: checked },
            }));
        } else {
            setMovie(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePosterChange = (e) => {
        setPoster(e.target.files[0]);
    };

    // Handle checkbox change for actors
    const handleActorCheckboxChange = (actorId) => {
        setMovie(prev => ({
            ...prev,
            actors: prev.actors.includes(actorId)
                ? prev.actors.filter(id => id !== actorId)
                : [...prev.actors, actorId]
        }));
    };

    // Handle checkbox change for directors
    const handleDirectorCheckboxChange = (directorId) => {
        setMovie(prev => ({
            ...prev,
            directors: prev.directors.includes(directorId)
                ? prev.directors.filter(id => id !== directorId)
                : [...prev.directors, directorId]
        }));
    };

    // Add more award fields
    const addAwardField = (type) => {
        if (type === 'actor') {
            setNewActor(prev => ({
                ...prev,
                awards: [...prev.awards, { title: '', year: '' }]
            }));
        } else {
            setNewDirector(prev => ({
                ...prev,
                awards: [...prev.awards, { title: '', year: '' }]
            }));
        }
    };

    // Handle submitting the movie
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', movie.title);
        formData.append('year', movie.year);
        formData.append('ageRestriction', movie.ageRestriction);
        formData.append('rating', movie.rating);
        formData.append('duration', movie.duration);
        formData.append('plot', movie.plot);
        formData.append('languages', movie.languages.join(','));
        formData.append('countriesOfOrigin', movie.countriesOfOrigin.join(','));
        formData.append('genres', movie.genres.join(','));
        formData.append('themes', movie.themes.join(','));
        movie.actors.forEach(actorId => formData.append('actors[]', actorId));
        movie.directors.forEach(directorId => formData.append('directors[]', directorId));
        if (poster) {
            formData.append('poster', poster);
        }
        formData.append('contentAdvisory[violence]', movie.contentAdvisory.violence);
        formData.append('contentAdvisory[vulgarLanguage]', movie.contentAdvisory.vulgarLanguage);
        formData.append('contentAdvisory[sexualContent]', movie.contentAdvisory.sexualContent);
        formData.append('contentAdvisory[drugUse]', movie.contentAdvisory.drugUse);

        try {
            let response;
            const authToken = getAuthToken();

            if (id) {
                response = await axios.put(`http://localhost:3000/api/movies/${encodeURIComponent(id)}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
            } else {
                response = await axios.post('http://localhost:3000/api/movies', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
            }
            if (response.status === 200 || response.status === 201) {
                navigate("/");
            }
        } catch (error) {
            console.error("Error creating/updating movie:", error);
        }
    };
    return (
        <form className="container add-movie-form my-5" onSubmit={handleSubmit} encType="multipart/form-data">
            <h2 className="heading">Update Movie</h2>

            <label className="label">
                <input
                    className="field-css"
                    type="file"
                    name="poster"
                    id="poster"
                    onChange={handlePosterChange}
                />
            </label> 

            <label className="label">
                <input
                    className="field-css"
                    type="text"
                    name="title"
                    value={movie.title}
                    onChange={handleChange}
                    placeholder="title"
                    required
                />
            </label>
    
            <div className="four-components">
                <label className="label field-component">
                    <input
                        className="field-css"
                        type="number"
                        name="year"
                        value={movie.year}
                        onChange={handleChange}
                        placeholder="year"
                        required
                    />
                </label>
    
                <label className="label field-component">
                    <input
                        className="field-css"
                        type="number"
                        name="ageRestriction"
                        value={movie.ageRestriction}
                        onChange={handleChange}
                        placeholder="age restriction"
                        min={0}
                    />
                </label>
    
                <label className="label field-component">
                    <input
                        className="field-css"
                        type="number"
                        name="rating"
                        value={movie.rating}
                        onChange={handleChange}
                        placeholder="rating"
                        min={1}
                        max={10}
                    />
                </label>
    
                <label className="label field-component">
                    <input
                        className="field-css"
                        type="text"
                        name="duration"
                        value={movie.duration}
                        placeholder="duration (e.g., '2h 30m')"
                        onChange={handleChange}
                    />
                </label>
            </div>
    
            <label className="label">
                <input
                    className="field-css"
                    type="text"
                    name="languages"
                    value={movie.languages}
                    placeholder="languages (comma-separated)"
                    onChange={(e) => setMovie({ ...movie, languages: e.target.value.split(",") })}
                />
            </label>
    
            <label className="label">
                <input
                    className="field-css"
                    type="text"
                    name="countriesOfOrigin"
                    value={movie.countriesOfOrigin}
                    placeholder="countries of origin (comma-separated)"
                    onChange={(e) => setMovie({ ...movie, countriesOfOrigin: e.target.value.split(",") })}
                />
            </label>
    
            <label className="label">
                <input
                    className="field-css"
                    type="text"
                    name="genres"
                    value={movie.genres}
                    placeholder="genres (comma-separated)"
                    onChange={(e) => setMovie({ ...movie, genres: e.target.value.split(",") })}
                />
            </label>
    
            <label className="label">
                <input
                    className="field-css"
                    type="text"
                    name="themes"
                    value={movie.themes}
                    placeholder="themes (comma-separated)"
                    onChange={(e) => setMovie({ ...movie, themes: e.target.value.split(",") })}
                />
            </label>
    
            <label className="label">
                <textarea
                    className="field-css textarea"
                    name="plot"
                    value={movie.plot}
                    placeholder="movie description..."
                    onChange={handleChange}
                />
            </label>
    
            <fieldset className="warning-checkbox">
                <label className="label warning-checkbox">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="violence"
                        checked={movie.contentAdvisory.violence}
                        onChange={handleChange}
                    />
                    Violence
                </label>
                <label className="label warning-checkbox">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="vulgarLanguage"
                        checked={movie.contentAdvisory.vulgarLanguage}
                        onChange={handleChange}
                    />
                    Vulgar Language
                </label>
                <label className="label warning-checkbox">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="sexualContent"
                        checked={movie.contentAdvisory.sexualContent}
                        onChange={handleChange}
                    />
                    Sexual Content
                </label>
                <label className="label warning-checkbox">
                    <input
                        className="checkbox"
                        type="checkbox"
                        name="drugUse"
                        checked={movie.contentAdvisory.drugUse}
                        onChange={handleChange}
                    />
                    Drug Use
                </label>
            </fieldset>
    
            {/* Actors Section */}
            <div>
                <h3 className="heading">Actors</h3>
                <div className="search-field">
                    <input
                        className="field-css"
                        type="text"
                        placeholder="Search actor by name"
                        value={actorName}
                        onChange={(e) => setActorName(e.target.value)}
                    />
                    <button className="button" type="button" onClick={searchActors}><img className="search-icon" src={SearchIcon} /></button>
                    {actors.length > 0 && (
                        <div className="search-close-btn">
                            <button className="close-btn" onClick={() => setActors([])}>
                                &times;
                            </button>
                            <ul className="list">
                                {actors.map(actor => (
                                    <li className="list-item" key={actor._id}>
                                        <label className="label">
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                checked={movie.actors.includes(actor._id)}
                                                onChange={() => handleActorCheckboxChange(actor._id)}
                                            />
                                            {actor.name} ({new Date(actor.birthdate).toLocaleDateString()})
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {actorText && <p>{actorText}</p>}
                    {noActorsFound && <p>No actors under this name.</p>}
                </div>
                {/* Create new actor section */}
                <div className="awards-button">
                    <h4 className="heading">Create New Actor</h4>
                    <button className="button" type="button" onClick={createActor}><img src={AddIcon}/></button>
                </div>
                <div className="add-new-instance">
                    <div className="new-instance">
                        <label className="label">
                            <input
                                className="new-instance-label field-css"
                                type="text"
                                value={newActor.name}
                                placeholder="name"
                                onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                            />
                        </label>
                        <label className="new-instance-label label">
                            <input
                                className="field-css"
                                type="date"
                                value={newActor.birthdate}
                                placeholder="birthdate"
                                onChange={(e) => setNewActor({ ...newActor, birthdate: e.target.value })}
                            />
                        </label>
                    </div>
                    <label className="label">
                        <textarea
                            className="field-css textarea"
                            value={newActor.bio}
                            placeholder="biography"
                            onChange={(e) => setNewActor({ ...newActor, bio: e.target.value })}
                        />
                    </label>
                    <div className="awards-button">
                        <h4 className="heading">Awards</h4>
                        <button className="button" type="button" onClick={() => addAwardField('actor')}><img src={AddIcon}/></button>
                    </div>
                    <div className="awards">
                        {newActor.awards.map((award, index) => (
                            <div key={index}>
                                <div className="new-instance">
                                    <label className="label">
                                        <input
                                            className="field-css"
                                            type="text"
                                            value={award.title}
                                            placeholder="title"
                                            onChange={(e) => {
                                                const updatedAwards = [...newActor.awards];
                                                updatedAwards[index].title = e.target.value;
                                                setNewActor({ ...newActor, awards: updatedAwards });
                                            }}
                                        />
                                    </label>
                                    <label className="label">
                                        <input
                                            className="field-css"
                                            type="number"
                                            value={award.year}
                                            placeholder="year"
                                            onChange={(e) => {
                                                const updatedAwards = [...newActor.awards];
                                                updatedAwards[index].year = e.target.value;
                                                setNewActor({ ...newActor, awards: updatedAwards });
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    
            {/* Directors Section */}
            <div>
                <h3 className="heading">Directors</h3>
                <div className="search-field">
                    <input
                        className="field-css"
                        type="text"
                        placeholder="Search director by name"
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                    />
                    <button className="button" type="button" onClick={searchDirectors}><img className="search-icon" src={SearchIcon} /></button>
                    {directors.length > 0 && (
                        <div className="search-close-btn">
                            <button className="close-btn" onClick={() => setDirectors([])}>
                                &times;
                            </button>
                            <ul className="list">
                                {directors.map(director => (
                                    <li className="list-item" key={director._id}>
                                        <label className="label">
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                checked={movie.directors.includes(director._id)}
                                                onChange={() => handleDirectorCheckboxChange(director._id)}
                                            />
                                            {director.name} ({new Date(director.birthdate).toLocaleDateString()})
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {directorText && <p>{directorText}</p>}
                    {noDirectorsFound && <p>No directors under this name.</p>}
                </div>
                {/* Create new director section */}
                <div className="awards-button">
                    <h4 className="heading">Create New Director</h4>
                    <button className="button" type="button" onClick={createDirector}><img src={AddIcon}/></button>
                </div>
                <div className="add-new-instance">
                    <div className="new-instance">
                        <label className="label">
                            <input
                                className="new-instance-label field-css"
                                type="text"
                                value={newDirector.name}
                                placeholder="name"
                                onChange={(e) => setNewDirector({ ...newDirector, name: e.target.value })}
                            />
                        </label>
                        <label className="new-instance-label label">
                            <input
                                className="field-css"
                                type="date"
                                value={newDirector.birthdate}
                                placeholder="birthdate"
                                onChange={(e) => setNewDirector({ ...newDirector, birthdate: e.target.value })}
                            />
                        </label>
                    </div>
                    <label className="label">
                        <textarea
                            className="field-css textarea"
                            value={newDirector.bio}
                            placeholder="biography"
                            onChange={(e) => setNewDirector({ ...newDirector, bio: e.target.value })}
                        />
                    </label>
                    <div className="awards-button">
                        <h4 className="heading">Awards</h4>
                        <button className="button" type="button" onClick={() => addAwardField('director')}><img src={AddIcon}/></button>
                    </div>
                    <div className="awards">
                        {newDirector.awards.map((award, index) => (
                            <div key={index}>
                                <div className="new-instance">
                                    <label className="label">
                                        <input
                                            className="field-css"
                                            type="text"
                                            value={award.title}
                                            placeholder="title"
                                            onChange={(e) => {
                                                const updatedAwards = [...newDirector.awards];
                                                updatedAwards[index].title = e.target.value;
                                                setNewDirector({ ...newDirector, awards: updatedAwards });
                                            }}
                                        />
                                    </label>
                                    <label className="label">
                                        <input
                                            className="field-css"
                                            type="number"
                                            value={award.year}
                                            placeholder="year"
                                            onChange={(e) => {
                                                const updatedAwards = [...newDirector.awards];
                                                updatedAwards[index].year = e.target.value;
                                                setNewDirector({ ...newDirector, awards: updatedAwards });
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button className="update-button" type="submit">Update Movie</button>
        </form>
    );
};

export default AddMovie;