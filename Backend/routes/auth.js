const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router(); // Creating an Express router instance

// Route to register a new user
router.post("/register", async(req, res) => {
    const { name, email, password, } = req.body; // Extracting user details from the request body

    // Check if a user with the same email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" }); // Respond with an error if the user exists
    }

    // Generate a salt and hash the password for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the provided details and hashed password
    const user = new User({ name, email, password: hashedPassword });

    try {
        const createdUser = await user.save(); // Save the user to the database
        res.status(201).json({
            id: createdUser._id, // Return the user's data
            name: createdUser.name,
            email: createdUser.email,
        });
    } catch (error) {
        res.status(500).json({ message: error.message }); // error msg
    }
});

// Route to log in an existing user
router.post("/login", async(req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body

    // Check if a user with the given email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" }); // Respond with an error if the user doesn't exist
    }

    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" }); // Respond with an error if passwords don't match
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Respond with the user's details and the token
    res.json({
        name: user.name, // Include the user's name in the response
        email: user.email, // Include the user's email in the response
        token: token, // Include the generated token in the response
    });
});

module.exports = router;