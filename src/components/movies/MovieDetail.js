import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./MovieDetails.css";
import Star from "../../images/Star-Emoji.png";
import Review from "./Review";
import ProfilePhoto from "../../images/profile-photo.png";
import StarRating from "./StarRating";
import Settings from "../../images/3dots.jpeg";
import Save from "../../images/save.png";
import DontSave from "../../images/dontSave.png";

const MovieDetail = () => {
  const [text, setText] = useState('');
  const [profile, setProfile] = useState({});
  const [movie, setMovie] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [expandedDirectors, setExpandedDirectors] = useState({});
  const [actors, setActors] = useState([]);
  const [expandedActors, setExpandedActors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewAuthors, setReviewAuthors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [reviewId, setReviewId] = useState('');
  const [userReviews, setUserReviews] = useState({
    userId: '',
    movieId: '',
    rating: '',
    comment: ''
  });
  const { id } = useParams();

  const loadMovie = async () => {
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const result = await axios.get(`http://localhost:3000/api/movies/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMovie(result.data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };
  

  const loadMovieDirectors = async () => {
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const result = await axios.get(`http://localhost:3000/api/movies/${id}/directors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDirectors(result.data);
    } catch (error) {
      console.error("Error fetching directors:", error);
    }
  };
  

  const loadMovieActors = async () => {
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const result = await axios.get(`http://localhost:3000/api/movies/${id}/actors`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setActors(result.data);
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };
  

  const loadReviews = async (movieId) => {
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const result = await axios.get(`http://localhost:3000/api/movies/${movieId}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReviews(result.data);
  
      const authors = {};
      await Promise.all(
        result.data.map(async (review) => {
          const authorResult = await axios.get(`http://localhost:3000/api/users/${review._id}/author`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          authors[review._id] = authorResult.data.name;
        })
      );
      setReviewAuthors(authors);
    } catch (error) {
      console.error("Error fetching reviews or authors:", error);
    }
  };
  ;

  useEffect(() => {
    if (id) {
      loadMovie();
      loadMovieDirectors();
      loadMovieActors();
      loadReviews(id);
    }
  }, [id]);

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
        setProfile(data);
        setUserReviews(prev => ({ ...prev, userId: data._id }));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    fetchProfile();
  }, []);  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    userReviews.userId = profile._id;
    userReviews.movieId = id;
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const response = await axios.post('http://localhost:3000/api/reviews', userReviews, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        console.log('Review created:', response.data);
        setReviews([...reviews, response.data]);
        setUserReviews({ rating: '', comment: '' });
      } else {
        console.error('Failed to create review:', response.status);
        setText('Review not posted.');
      }
    } catch (error) {
      console.error('Error posting review:', error.response ? error.response.data : error.message);
      setText('Review not posted.');
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserReviews(prevReviews => ({
      ...prevReviews,
      [name]: value
    }));
  };  

  const handleRatingChange = (rating) => {
    setUserReviews(prevReviews => ({
      ...prevReviews,
      rating: rating
    }));
  };  

  const handleReviewDelete = async (reviewId) => {
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const response = await axios.delete(`http://localhost:3000/api/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setReviews(reviews.filter(review => review._id !== reviewId));
        setUserReviews({ rating: '', comment: '' });
      }
    } catch (error) {
      console.error('Error deleting review:', error.response ? error.response.data : error.message);
      setText('Something went wrong! Review not deleted.');
    }
  };
  

  const handleEditClick = (review) => {
    setReviewId(review._id);
    setEditMode(true);
    setUserReviews({
      comment: review.comment,
      rating: review.rating,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const token = sessionStorage.getItem('token')?.replace(/"/g, '');
      const response = await axios.put(`http://localhost:3000/api/reviews/${reviewId}`, {
        comment: userReviews.comment,
        rating: userReviews.rating,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        setReviews(reviews.map(review => review._id === reviewId ? response.data : review));
      }
    } catch (error) {
      console.error('Error editing review:', error.response ? error.response.data : error.message);
      setText('Something went wrong! Review not edited.');
    }
    setEditMode(false);
    setUserReviews({
      comment: '',
      rating: '',
    });
  };
  
  
  const handleDontSaveChanges = () => {
    setEditMode(false);
    setUserReviews({
      comment: '',
      rating: '',
    });
  };


  const toggleDirectorDetails = async (directorId) => {
    if (expandedDirectors[directorId]) {
      setExpandedDirectors(prev => ({ ...prev, [directorId]: null }));
    } else {
      try {
        const directorResult = await axios.get(`http://localhost:3000/api/directors/${directorId}`);
        const moviesResult = await axios.get(`http://localhost:3000/api/directors/${directorId}/movies`);

        setExpandedDirectors(prev => ({
          ...prev,
          [directorId]: { ...directorResult.data, movies: moviesResult.data },
        }));
      } catch (error) {
        console.error("Error fetching director:", error);
      }
    }
  };

  const toggleActorDetails = async (actorId) => {
    if (expandedActors[actorId]) {
      setExpandedActors(prev => ({ ...prev, [actorId]: null }));
    } else {
      try {
        const actorResult = await axios.get(`http://localhost:3000/api/actors/${actorId}`);
        const moviesResult = await axios.get(`http://localhost:3000/api/actors/${actorId}/movies`);

        setExpandedActors(prev => ({
          ...prev,
          [actorId]: { ...actorResult.data, movies: moviesResult.data },
        }));
      } catch (error) {
        console.error("Error fetching actor:", error);
      }
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="detailsClass">
        <div id="details-title-rate">
          <div id="details-title">
            <Link className="back-home btn btn-secondary ml-2" to="/">Back to Home</Link>
            <h1>{movie.title}</h1>
            <p>{movie.year} • R-{movie.ageRestriction} • {movie.duration}</p>
          </div>
          <div id="details-rating">
            <h1 className="rating pricing-card-title">
              <img className="starLogo" src={Star} alt="Star" />
              {movie.rating}<small className="fw-light">/10</small>
            </h1>
          </div>
        </div>
        <div id="genres-themes">
          <div className="genres-content">
            {movie.genres.map((genre, index) => (
              <span key={index} className="badge bg-dark-subtle text-dark-emphasis rounded-pill">
                {genre}
              </span>
            ))}
          </div>
          <div>
            {(movie.contentAdvisory.violence || 
              movie.contentAdvisory.vulgarLanguage || 
              movie.contentAdvisory.sexualContent || 
              movie.contentAdvisory.drugUse) && (
              <div className="genres-content">
                {movie.contentAdvisory.violence && <span className="badge rounded-pill text-bg-warning">Violence</span>}
                {movie.contentAdvisory.vulgarLanguage && <span className="badge rounded-pill text-bg-warning">Vulgar Language</span>}
                {movie.contentAdvisory.sexualContent && <span className="badge rounded-pill text-bg-warning">Sexual Content</span>}
                {movie.contentAdvisory.drugUse && <span className="badge rounded-pill text-bg-warning">Drug Use</span>}
              </div>
            )}
          </div>
        </div>
        <div id="lang-plot">
          <div id="lang">
            <p><strong>Languages:</strong> {movie.languages.join(", ")}</p>
            <p><strong>Countries of Origin:</strong> {movie.countriesOfOrigin.join(", ")}</p>
          </div>
          <div id="plot">
            <p>{movie.plot}</p>
            <div className="themes-content">
              {movie.themes.map((theme, index) => (
                <span key={index} className="badge bg-danger-subtle text-danger-emphasis rounded-pill">
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      
        <h1 className="review-label">Directors</h1>
        <ul className="director-list">
          {directors.length > 0 ? (
            directors.map(director => (
              <li key={director._id} className="director-item">
                <div className="director-summary">
                  <p className="director-name">{director.name}</p>
                  <button
                    className="toggle-details-btn" 
                    onClick={() => toggleDirectorDetails(director._id)}
                  >
                    {expandedDirectors[director._id] ? "𒉽" : "▽"}
                  </button>
                </div>

                {expandedDirectors[director._id] && (
                  <div className="director-details mt-2">
                    <div className="director-details-part1">
                      <p><strong>Birthday: </strong>{new Date(expandedDirectors[director._id].birthdate).toLocaleDateString()}</p>
                      <p><strong>Nationality: </strong>{expandedDirectors[director._id].nationality}</p>
                    </div>
                    <div className="director-details-part2">
                      <p>{expandedDirectors[director._id].bio}</p>
                      <p>Awards:<br/>{expandedDirectors[director._id].awards.map(award => `${award.awardName} (${award.year})`).join(", ")}</p>
                      {/* <label>Movies:</label>
                      <ul className="movies-directed-list">
                        {expandedDirectors[director._id].movies.length > 0 ? (
                          expandedDirectors[director._id].movies.map(movie => (
                            <li key={movie._id} className="movie-item">{movie.title}</li>
                          ))
                        ) : (
                          <p>No movies listed.</p>
                        )}
                      </ul> */}
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No directors listed for this movie.</p>
          )}
        </ul>
        
        <h1 className="review-label">Starring</h1>
        <ul className="director-list">
          {actors.length > 0 ? (
            actors.map(actor => (
              <li key={actor._id} className="director-item">
                <div className="director-summary">
                  <p className="director-name">{actor.name}</p>
                  <button
                    className="toggle-details-btn" 
                    onClick={() => toggleActorDetails(actor._id)}
                  >
                    {expandedActors[actor._id] ? "𒉽" : "▽"}
                  </button>
                </div>

                {expandedActors[actor._id] && (
                  <div className="director-details mt-2">
                    <div className="director-details-part1">
                      <p><strong>Birthday: </strong>{new Date(expandedActors[actor._id].birthdate).toLocaleDateString()}</p>
                      <p><strong>Nationality: </strong>{expandedActors[actor._id].nationality}</p>
                    </div>
                    <div className="director-details-part2">
                      <p>{expandedActors[actor._id].bio}</p>
                      <p>Awards:<br/>{expandedActors[actor._id].awards.map(award => `${award.awardName} (${award.year})`).join(", ")}</p>
                      {/* <label>Movies:</label>
                      <ul className="movies-directed-list">
                        {expandedActors[actor._id].movies.length > 0 ? (
                          expandedActors[actor._id].movies.map(movie => (
                            <li key={movie._id} className="movie-item">{movie.title}</li>
                          ))
                        ) : (
                          <p>No movies listed.</p>
                        )}
                      </ul> */}
                    </div>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>No actors listed for this movie.</p>
          )}
        </ul>

        <label className="review-label">Reviews</label>
        <div className="review-container">
          <div className="user-review">
            <img src={ProfilePhoto} className="review-profilePhoto" alt="Profile"/>
            <div className="user-review-content">
              <p className="user-review-usernname">{profile.name}</p>
              <form className="review-elements" onSubmit={editMode ? handleSaveChanges : handleSubmit}>
                <input
                  id="comment"
                  name="comment"
                  value={userReviews.comment}
                  placeholder="Your comment..."
                  onChange={handleChange}
                  required
                />
                <div>
                  <StarRating 
                    rating={userReviews.rating} 
                    onRatingChange={handleRatingChange} 
                  />
                  {editMode ? (
                    <div className="save-dontSave">
                      <button type="button" className="submit-button" onClick={handleSaveChanges}><img className="edit-review-buttons" src={Save}/></button>
                      <button type="button" className="cancel-button" onClick={handleDontSaveChanges}><img className="edit-review-buttons" src={DontSave}/></button>
                    </div>
                  ) : (
                    <button type="submit" className="submit-button">Submit Review</button>
                  )}
                </div>
                {text && <p className="warning">{text}</p>}
              </form>

            </div>
          </div>

          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review._id} className="review mb-4 p-2w-50">
                <img src={ProfilePhoto} className="review-profilePhoto" alt="Profile"/>
                <div className="review-content">
                  <div className="star-date">
                    <Review key={review._id} review={review} />
                    {(new Date(review.createdAt)) < (new Date(review.lastModified)) ? (
                      <p className="review-date">(edited) {new Date(review.lastModified).toLocaleDateString()}</p>
                    ) : (
                      <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="name-settings">
                    <p className="review-author"><strong>{reviewAuthors[review._id] || profile.name}</strong></p>
                    
                    {profile._id === review.userId && (
                      <div className="dropdown">
                        <button className="btn border-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img className='settings-image' src={Settings} alt="Settings" />
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className='movieDetail-button dropdown-elements delete-link text-secondary-emphasis' onClick={() => handleEditClick(review)}>Edit Review</button></li>
                            <button className='movieDetail-button dropdown-elements delete-link' onClick={() => handleReviewDelete(review._id)}>Delete Review</button>
                        </ul>
                      </div>
                    )}
                    </div>
                  <p className="review-content">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available for this movie.</p>
          )}
        </div>
      </div>
    </div>
  );

};

export default MovieDetail;