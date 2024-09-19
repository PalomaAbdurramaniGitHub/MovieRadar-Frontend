import React, { useState, useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Home from "./components/pages/Home";
import About from "./components/about/About";
import Contact from "./components/contactUs/ContactUs";
import Navbar from "./components/layout/Navbar";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import NotFound from "./components/pages/NotFound";
import MovieDetail from "./components/movies/MovieDetail";
import LoginPage from "./components/pages/Login";
import SignupPage from "./components/pages/Signup";
import Footer from "./components/layout/Footer";
import ProfilePage from "./components/pages/Profile";
import ProfileEdit from "./components/pages/ProfileEdit";
import ChangeEmailAddress from "./components/pages/ChangeEmailAddress";
import ChangePassword from "./components/pages/ChangePassword";
import DeleteAccount from "./components/pages/DeleteAccount";
import AddMovie from "./components/movies/AddMovie";
import EditMovie from "./components/movies/EditMovie";
import Loading from "./components/loading/Loading";

function App(props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLoading(false);
    };

    fetchData();
  }, []);

  if(loading){
    return <Loading/>
  }
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/editProfile" element={<ProfileEdit />} />
          <Route path="/changeEmailAddress" element={<ChangeEmailAddress />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/deleteAccount" element={<DeleteAccount />} />
          <Route path="/addMovie" element={<AddMovie />} />
          <Route path="/editMovie/:id" element={<EditMovie />} />
          <Route element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;