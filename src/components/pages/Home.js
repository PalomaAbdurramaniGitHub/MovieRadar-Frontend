import React, { useState, useEffect } from "react";
import axios from "axios";
import Star from "../../images/Star-Emoji.png";
import "./Home.css";
import { Link, NavLink } from "react-router-dom";
import AddMovie from "../../images/add-movie.png";
import MovieScreens from "../../images/movie-screen.jpg";
import EditIcon from "../../images/edit-icon-image-29.png";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = JSON.parse(sessionStorage.getItem('token') || '""');
      if (!token) {
        console.error('No auth token found');
        return;
      }

      try {
        // Fetch the user's profile
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

        await generateSuggestions(data._id);
        await loadSuggestions(data._id);

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Function to fetch suggestions for the user
  const loadSuggestions = async (userId) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token') || '""');
      const response = await axios.get(`http://localhost:3000/api/suggestions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: { userId }
      });
      setSuggestions(shuffleArray(response.data));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Function to generate suggestions for the user
  const generateSuggestions = async (userId) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token') || '""');
      const response = await axios.post('http://localhost:3000/api/suggestions/generate', { userId }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Suggestions generated:', response.data); // Debugging line
    } catch (error) {
      console.error('Error generating suggestions:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const result = await axios.get("http://localhost:3000/api/movies");
        setMovies(shuffleArray(result.data));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleMovieDelete = async (movieId) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token') || '""');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await axios.delete(`http://localhost:3000/api/movies/${encodeURIComponent(movieId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 200) {
        setMovies(movies.filter(movie => movie._id !== movieId));
      }
    } catch (error) {
      console.error('Error deleting movie:', error.response ? error.response.data : error.message);
    }
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        {profile.isAdmin && (
          <div className="admin-only my-5">
            <div className="add-movie-div">
              <h1 className="admin-text">Admin access granted.</h1>
              <div className="add-movie-button">
                <Link to="/addMovie">
                  <img className="add-movie" src={AddMovie} alt="Add Movie" />
                </Link>
                <p>Add movie</p>
              </div>
            </div>
            <img className="movie-screens" src={MovieScreens} alt="Movie Screens" />
          </div>
        )}

        {/* Suggestions Carousel */}
        {!profile.isAdmin && (
          <>
          {suggestions.length > 0 && (
            <div className="suggestions-section my-5">
              <h2>Suggested for You</h2>
              <Carousel responsive={responsive} infinite>
                {suggestions.map((suggestion) => {
                  const movie = suggestion.movieId;
                  return (
                    <div className="movieComponent p-5 rounded-3" key={movie?._id}>
                      <img src={`http://localhost:3000/${movie?.poster}`} alt={`${movie?.title} Poster`} className="movie-poster" />
                      <h2 className="title">{movie?.title || 'Untitled'}</h2>
                      <div className="details-rating">
                        <p>{movie?.year || 'Year'} • {movie?.duration || 'Duration'}</p>
                        <h1 className="rating pricing-card-title">
                          <img className="starLogo" src={Star} alt="Star" />
                          {movie?.rating || 0}<small className="fw-light">/10</small>
                        </h1>
                      </div>
                      <p>{suggestion.relevance}</p>
                      <NavLink className="moreBtn" to={`/movies/${movie?._id}`}>More about this</NavLink>
                    </div>
                  );
                })}
              </Carousel>
            </div>
          )}
          </>
        )}

        {/* Movies Carousel */}
        <h2>Other Movies</h2>
        <Carousel responsive={responsive} infinite>
          {movies.map((movie) => (
            <div className="movieComponent p-5 rounded-3" key={movie._id}>
              <img src={`http://localhost:3000/${movie.poster}`} alt={`${movie.title} Poster`} className="movie-poster" />
              <h2 className="title">{movie.title}</h2>
              <div className="details-rating">
                <p>{movie.year} • {movie.duration}</p>
                <h1 className="rating pricing-card-title">
                  <img className="starLogo" src={Star} alt="Star" />
                  {movie.rating}<small className="fw-light">/10</small>
                </h1>
              </div>
              <NavLink className="moreBtn" to={`/movies/${movie._id}`}>More about this</NavLink>
              {profile.isAdmin && (
                <ul className="admin-edit-delete">
                  <li className="admin-home-btn">
                    <NavLink className='admin-edit' to={`/editMovie/${movie._id}`}>Edit<img className="edit-icon" src={EditIcon} alt="Edit" /></NavLink>
                  </li>
                  <li className="admin-home-btn">
                    <button className='admin-delete' onClick={() => handleMovieDelete(movie._id)}>Delete</button>
                  </li>
                </ul>
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Home;