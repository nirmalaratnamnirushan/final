const Product = require("../models/productModel"); // Import the Product model for database interaction
const path = require("path"); // Import the path module for working with file and directory paths
const fs = require("fs"); // Import the file system module for handling files

// Hardcoded base URL for image storage
const imageBaseUrl = '../uploads'; // Replace with your actual domain or server URL

// Add Product
exports.addProduct = async(req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const image = req.file ? `${imageBaseUrl}/${req.file.filename}` : null; // Store full image path

        const product = await Product.create({ name, quantity, price, image });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Products
exports.getProducts = async(req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Product by ID
exports.getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Product
exports.updateProduct = async(req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const image = req.file ? `${imageBaseUrl}/${req.file.filename}` : null;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name || product.name;
        product.quantity = quantity || product.quantity;
        product.price = price || product.price;
        if (image) {
            product.image = image;
        }

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Product
exports.deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, "../uploads", path.basename(product.image));
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Error deleting image:", err);
            });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Product and its image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};