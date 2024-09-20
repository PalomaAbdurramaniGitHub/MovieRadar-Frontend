import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ContactUs.css";

const ContactUs = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =  JSON.parse(localStorage.getItem('token'));
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setStatus("Please log in to send a message.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setStatus("You must be logged in to send a message.");
      return;
    }

    try {
      const token =  JSON.parse(localStorage.getItem('token'));
      await axios.post(
        "http://localhost:3000/api/contact/form", 
        { message }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("Message sent successfully!");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send the message. Please try again.");
    }
  };

  return (
    <div className="container contactUs-container">
      <p><strong>We Value Your Feedback!</strong> <br/><br/>
        We're always striving to make our platform better, and your input is incredibly valuable to us. Feel free to write reviews, share your suggestions, or provide any feedback you have. Whether it's about movies, features you'd like to see, or ways we can improve, we want to hear from you!
        <br/><br/>
        Rest assured, we'll be notified of your messages and will do our best to take your suggestions into account. Your voice helps us shape a better experience for everyone. Thank you for being a part of our community!  💡📝
      </p>
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="contactUs-form">
          <div>
            <textarea
            className="contactUs-textarea"
              id="message"
              name="message"
              value={message}
              placeholder="Write your review, suggestions, or feedback here..."
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="contactUs-button">Send Message</button>
        </form>
      ) : (
        <p>{status}</p>
      )}
      {status && <p>{status}</p>}
    </div>
  );
};

export default ContactUs;