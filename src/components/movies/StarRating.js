import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(null);

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const handleClick = (index) => {
    onRatingChange(index);
  };

  return (
    <div className="star-rating">
      {[...Array(10)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <span
            key={starIndex}
            className={`star ${starIndex <= (hoverRating || rating) ? 'filled' : ''}`}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;