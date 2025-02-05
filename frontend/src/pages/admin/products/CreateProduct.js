import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CreateProduct = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
  });

  // State to store validation errors
  const [errors, setErrors] = useState({});

  // Hook for navigation
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    let validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Name is required.";
    }
    if (!formData.price || formData.price <= 0) {
      validationErrors.price = "Price must be a positive number.";
    }
    if (!formData.quantity || formData.quantity < 0) {
      validationErrors.quantity = "Quantity must be a non-negative number.";
    }
    if (!formData.image) {
      validationErrors.image = "Image is required.";
    }

    // If there are validation errors, update state and return early
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create FormData object for file upload
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("quantity", formData.quantity);
    formDataObj.append("image", formData.image);

    try {
      // Send form data to backend API
      await axios.post("http://localhost:5000/api/products", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Redirect to product list after successful submission
      navigate("/admin/products");
    } catch (error) {
      alert("Unable to connect to the server!");
    }
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4 rounded">
            {/* Form Heading */}
            <h2 className="text-center mb-4 text-success">Create New Item</h2>

            {/* Product Form */}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
              {/* Item Name Field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Item Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="text-danger">{errors.name}</div>}
              </div>

              {/* Price Field */}
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="Enter item price"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <div className="text-danger">{errors.price}</div>}
              </div>

              {/* Quantity Field */}
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  placeholder="Enter item quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
              </div>

              {/* Image Upload Field */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Select Item Image</label>
                <input
                  className="form-control"
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
                {errors.image && <div className="text-danger">{errors.image}</div>}
              </div>

              {/* Buttons */}
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <button type="submit" className="btn btn-success w-100 py-2 shadow">
                    Submit
                  </button>
                </div>
                <div className="col-sm-6 mb-3">
                  <Link className="btn btn-secondary w-100 py-2 shadow" to="/admin/products">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          body {
            background-color: #f9f9f9;
            font-family: 'Arial', sans-serif;
          }

          .container {
            max-width: 900px;
          }

          .card {
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .text-success {
            color: #28a745 !important;
          }

          .btn {
            border-radius: 5px;
            font-size: 1.1rem;
          }

          .btn-success {
            background-color: #28a745;
            border: none;
            transition: background-color 0.3s ease;
          }

          .btn-success:hover {
            background-color: #218838;
          }

          .btn-secondary {
            background-color: #6c757d;
            border: none;
            transition: background-color 0.3s ease;
          }

          .btn-secondary:hover {
            background-color: #5a6268;
          }

          .form-control {
            border-radius: 5px;
            padding: 10px;
            font-size: 1.1rem;
          }

          .form-label {
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 1.1rem;
          }

          .text-danger {
            font-size: 0.9rem;
            margin-top: 5px;
          }

          .mb-3 {
            margin-bottom: 1.5rem;
          }

          .row {
            margin-top: 2rem;
          }

          .shadow {
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          .w-100 {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default CreateProduct;
