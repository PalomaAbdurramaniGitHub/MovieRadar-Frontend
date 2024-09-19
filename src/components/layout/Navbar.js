import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../images/white-logo.jpg";
import { getUser, logout } from "../../helpers";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  let debounceTimeout = null;

  const handleLogout = () => {
    logout(() => navigate('/'));
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      if (query) {
        try {
          const response = await axios.get(`http://localhost:3000/api/movies/search`, {
            params: { title: query }
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
  };

  const handleResultClick = (movieId) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/movies/${movieId}`);
  };

  return (
    <div className="navbarContainer">
      <div className="container d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start py-3">
        <a href="/" id="logoDiv" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <img id="logo" src={logo} alt="MovieRadar Logo" />
          <p id="title">MovieRadar</p>
        </a>

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <NavLink className="nav-link component" to="/">Home</NavLink>
          <NavLink className="nav-link component" to="/profile">Profile</NavLink>
          <NavLink className="nav-link component" to="/about">About</NavLink>
          <NavLink className="nav-link component" to="/contact">Contact</NavLink>
        </ul>

        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 search-bar-container" role="search">
          <input
            type="search"
            className="search-bar form-control searchField"
            placeholder="Search..."
            aria-label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {/* Display search results */}
          {searchResults.length > 0 && (
            <div className="search-results-container">
              <button className="close-btn" onClick={() => setSearchResults([])}>
              &times;
              </button>
              <ul className="search-results">
                {searchResults.map((movie) => (
                  <li key={movie._id} onClick={() => handleResultClick(movie._id)}>
                    {movie.title} ({movie.year})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {!user ? (
          <div className="text-end">
            <NavLink className="nav-link loginBtn" to="/login">Login</NavLink>
          </div>
        ) : (
          <div className="text-end">
            <button onClick={handleLogout} className="btn btn-link nav-link loginBtn">Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;