const jwt = require("jsonwebtoken"); // Import the JSON Web Token library for token creation and verification
const User = require("../models/userModel"); // Import the User model for database interaction

// Middleware to protect routes (verifies JWT token)
const protect = async (req, res, next) => {
    let token; // Variable to hold the token

    // Check if the Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(" ")[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user information (excluding the password) to the request object
            req.user = await User.findById(decoded.id).select("-password");

            // Call the next middleware or route handler
            next();
        } catch (error) {
            // If token verification fails, send a 401 Unauthorized response
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // If no token is found, send a 401 Unauthorized response
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Export the protect and admin middlewares
module.exports = { protect };