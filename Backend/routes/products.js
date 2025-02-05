const express = require("express"); // Importing Express to create and manage routes
const multer = require("multer"); // Importing Multer for file (image) upload handling
const path = require("path"); // Importing Path to work with file and directory paths
const { protect } = require("../middlewares/authMiddleware"); // Importing middleware for authentication and admin authorization
const { 
    addProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require("../controllers/productController"); // Importing product-related controller functions

const router = express.Router(); // Creating an Express router instance for product-related routes

// Multer setup for image upload
const storage = multer.diskStorage({
    // Specify the destination folder where uploaded images will be saved
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // The "uploads/" directory will store images
    },
    // Specify the file name for the uploaded image
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Using the current timestamp and file extension for unique naming
    },
});

// Create a Multer instance with the defined storage configuration
const upload = multer({ storage: storage });

// Routes for managing products
router.route("/")
    .post(upload.single("image"), addProduct) // Route to add a new product, including image upload
    .get(getProducts); // Route to fetch all products

router.route("/:id")
    .get(getProductById) // Route to fetch a specific product by its ID
    .put(upload.single("image"), updateProduct) // Route to update a product, including image upload
    .delete(deleteProduct); // Route to delete a specific product by its ID

module.exports = router; 