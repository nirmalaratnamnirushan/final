const User = require("../models/userModel"); // Import the User model for database interaction
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for generating authentication tokens
const bcrypt = require("bcryptjs"); // Import bcrypt for hashing and comparing passwords

// Function to generate a JSON Web Token (JWT) for user authentication
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); // Sign a token with the user ID, using a secret key and an expiration of 30 days
};

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body; // Destructure user details from the request body

  try {
    // Check if a user with the same email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" }); // Return an error if the user exists
    }

    // Create a new user in the database
    const user = await User.create({ name, email, password });

    // Send a success response with user details and a generated JWT token
    res.status(201).json({
      _id: user.id, // User ID
      name: user.name, // User name
      email: user.email, // User email
      token: generateToken(user.id), // Authentication token for the user
    });
  } catch (error) {
    // Handle any errors during the registration process
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from the request body

  try {
    // Find a user in the database by their email
    const user = await User.findOne({ email });

    // Check if the user exists and if the provided password matches the hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Send a success response with user details and a generated JWT token
      res.status(200).json({
        _id: user.id, // User ID
        name: user.name, // User name
        email: user.email, // User email
        token: generateToken(user.id), // Authentication token for the user
      });
    } else {
      // Return an error if the credentials are invalid
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    // Handle any errors during the login process
    res.status(500).json({ message: error.message });
  }
};
