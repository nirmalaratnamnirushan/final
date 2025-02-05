const express = require("express"); 
const dotenv = require("dotenv"); 
const mongoose = require("mongoose"); 
const cors = require("cors"); 
const path = require("path");                                  // Importing path to work with file and directory paths

dotenv.config();                                              // get environment variables from  .env file

const app = express();                                       // Initializing the Express application

// Middleware
app.use(express.json());                                    // Middleware to parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));           // Middleware to parse URL-encoded data (e.g., form submissions)
app.use(cors());                                           // Enabling CORS for all routes to allow cross-origin requests

// Serving static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); 

// Routes
const productRoutes = require("./routes/products");                                // Importing product-related routes
const authRoutes = require("./routes/auth");                                      // Importing authentication-related routes

// Defining base API routes for products and authentication
app.use("/api/products", productRoutes);                                         // All product-related endpoints will start with `/api/products`
app.use("/api/auth", authRoutes);                                                // All authentication-related endpoints will start with `/api/auth`

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,                                                         // Avoid deprecation warning for MongoDB connection
        useUnifiedTopology: true,                                                      // Enables the new server discovery and monitoring engine
    })
    .then(() => console.log("MongoDB Connected")) 
    .catch((err) => console.log("MongoDB Error: ", err)); 

// Setting up the server to listen on the specified port
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
