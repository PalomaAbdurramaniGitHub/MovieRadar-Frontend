import React from "react";
import "./Navbar.css";

const Footer = () => {
    return (
        <div className="footer container mb-5">
            <footer className="d-flex flex-wrap justify-content-between align-items-center pt-3 mt-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                <span className="mb-3 mb-md-0 footerDiv">© 2024 MovieRadar</span>
                </div>
            </footer>
        </div>
    );
}

export default Footer;