import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext); // Access authentication context
  const [formData, setFormData] = useState({ email: "", password: "" }); // State for login form data
  const [message, setMessage] = useState(null); // State for success/error messages

  // Automatically clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), 3000);
    }
  }, [message]);

  // Handle input changes and update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to API
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // If successful, store token and navigate
      if (response.data && response.data.token) {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.token }); // Dispatch login action
        localStorage.setItem("token", response.data.token); // Store token in local storage
        setMessage({ type: "success", text: "Login successful!" }); // Display success message
        navigate("/view"); // Redirect to dashboard or home page
      } else {
        setMessage({ type: "error", text: "Invalid server response." });
      }
    } catch (error) {
      // Handle login error
      setMessage({ type: "error", text: error.response?.data?.message || "Login failed." });
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Login</h2>
        
        {/* Display success/error message */}
        {message && <div className={`message-box ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">Log In</button>
        </form>

        {/* Redirect to Signup */}
        <div className="redirect-links">
          <p>Don't have an account? <Link to="/register" className="signup-link">Sign Up</Link></p>
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
          
          /* Center login form */
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #ffedd5, #ffc078);
          }

          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100%;
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
            color: #f66d44;
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
            border: 1px solid #f66d44;
            border-radius: 5px;
            outline: none;
          }

          /* Login Button */
          .submit-btn {
            width: 100%;
            padding: 10px;
            background: #f66d44;
            border: none;
            color: #fff;
            font-size: 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
          }

          .submit-btn:hover {
            background: #e65a36;
          }

          /* Signup link */
          p {
            margin-top: 1rem;
            color: #555;
          }

          a {
            color: #f66d44;
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

export default Login;
