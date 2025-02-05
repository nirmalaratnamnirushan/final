import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  const [formData, setFormData] = useState({ name: "", email: "", password: "" }); // State for form inputs
  const [message, setMessage] = useState(null); // State for success/error messages

  // Handle input changes and update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled
    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields!" });
      return;
    }

    try {
      // Send registration request to API
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      setMessage({ type: "success", text: "Registration successful!" });
      setFormData({ name: "", email: "", password: "" }); // Reset form fields
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      // Handle registration error
      setMessage({ type: "error", text: err.response?.data?.message || "Registration failed. Please try again." });
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>Create Your Account</h2>

        {/* Display success/error message */}
        {message && (
          <div className={`message-box ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">Sign Up</button>
        </form>

        {/* Redirect to Login */}
        <div className="utility-links">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>

      {/* Inline CSS Styling */}
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
          }
          
          /* Center register form */
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #d4fc79, #96e6a1);
          }

          .register-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh;
          }

          .form-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          h2 {
            margin-bottom: 1rem;
            color: #28a745;
          }

          .input-group {
            margin-bottom: 1rem;
            text-align: left;
          }

          label {
            font-weight: 600;
            color: #333;
          }

          input {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #28a745;
            border-radius: 5px;
            outline: none;
          }

          /* Register Button */
          .submit-button {
            width: 100%;
            padding: 10px;
            background: #28a745;
            border: none;
            color: #fff;
            font-size: 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
          }

          .submit-button:hover {
            background: #218838;
          }

          /* Login link */
          p {
            margin-top: 1rem;
            color: #555;
          }

          a {
            color: #28a745;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          /* Message Box Styles */
          .message-box {
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            text-align: center;
            font-weight: bold;
          }

          .message-box.error {
            background-color: #ffcccc;
            color: #cc0000;
          }

          .message-box.success {
            background-color: #ccffcc;
            color: #006600;
          }
        `}
      </style>
    </div>
  );
};

export default Register;
