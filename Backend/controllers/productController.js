const Product = require("../models/productModel"); // Import the Product model for database interaction
const path = require("path"); // Import the path module for working with file and directory paths
const fs = require("fs"); // Import the file system module for handling files

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, quantity, price } = req.body; // Destructure product details from the request body
    const image = req.file ? req.file.filename : null; // If an image file is uploaded, get its filename

    // Create a new product in the database
    const product = await Product.create({ name, quantity, price, image });

    // Respond with the created product
    res.status(201).json(product);
  } catch (error) {
    // Handle errors during product creation
    res.status(500).json({ message: error.message });
  }
};

// Get All Products
exports.getProducts = async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find();

    // Respond with the list of products
    res.status(200).json(products);
  } catch (error) {
    // Handle errors during retrieval
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    // Find a product by its ID (provided in the request parameters)
    const product = await Product.findById(req.params.id);

    // If no product is found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Respond with the found product
    res.status(200).json(product);
  } catch (error) {
    // Handle errors during retrieval
    res.status(500).json({ message: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, quantity, price } = req.body; // Destructure updated product details from the request body
    const image = req.file ? req.file.filename : null; // If an updated image is uploaded, get its filename

    // Find the product by its ID
    const product = await Product.findById(req.params.id);

    // If no product is found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product's fields if provided, otherwise retain the existing values
    product.name = name || product.name;        // while update if the name is changed then the newname is assigned to the product.name other wise it is taking the old name
    product.quantity = quantity || product.quantity;
    product.price = price || product.price;
    if (image) {
      product.image = image; // Update the product's image if a new one is provided
    }

    // Save the updated product to the database
    const updatedProduct = await product.save();

    // Respond with the updated product
    res.status(200).json(updatedProduct);
  } catch (error) {
    // Handle errors during the update
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    // Find the product by its ID
    const product = await Product.findById(req.params.id);

    // If no product is found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product has an associated image and delete the file
    if (product.image) {
      const imagePath = path.join(__dirname, "../uploads", product.image); // Construct the path to the image
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err); // Log any errors while deleting the image
        }
      });
    }

    // Delete the product from the database
    await Product.deleteOne({ _id: req.params.id });

    // Respond with a success message
    res.status(200).json({ message: "Product and its image deleted successfully" });
  } catch (error) {
    // Handle errors during deletion
    res.status(500).json({ message: error.message });
  }
};
