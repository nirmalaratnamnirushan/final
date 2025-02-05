import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome icons

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom box-shadow">
      <div className="container d-flex justify-content-between">
        {/* Logo and brand name */}
        <Link className="navbar-brand" to="/">
          <img 
            src="/images/bakeryicon1.png" 
            alt="Logo" 
            width="40" 
            height="40" 
            className="me-2 rounded-circle" 
          />
          Bakery Shop
        </Link>

        {/* Navbar toggler button for small screens */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible navigation menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0"> {/* Aligns nav items to the right */}
            
            {/* Home link */}
            <li className="nav-item">
              <Link className="nav-link" to="/admin/products">
                <i className="fas fa-home me-1"></i>Home
              </Link>
            </li>

            {/* Create Item link */}
            <li className="nav-item">
              <Link className="nav-link" to="/admin/products/create">
                <i className="fa-solid fa-plus me-1"></i> Create Item
              </Link>
            </li>

            {/* Logout link */}
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <i className="fas fa-sign-out-alt me-1"></i>Logout
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}
