import React from 'react';
import starImage from "../../images/clicked.jpg";

const Review = ({ review }) => {
  const ratingStars = review.rating;
  const stars = Array(ratingStars).fill(starImage);

  return (
    <div>
      {stars.map((star, index) => (
        <img
          key={index}
          src={star}
          alt="star"
          style={{ height: '12px', marginRight: '2px', padding: '0'}}
        />
      ))}
    </div>
  );
};

export default Review;