import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import { ToastContainer } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams(); // Get product ID from URL params
  const navigate = useNavigate(); // Navigation hook for redirecting

  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
    old_image: "",
  });

  const [validationErrors, setValidationErrors] = useState({}); // State to track validation errors
  const [isLoading, setIsLoading] = useState(true); // Loading state while fetching product data
  const baseURL = "http://localhost:5000/uploads/"; // Base URL for images

  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
        // Populate form fields with existing product data
        setFormData({
          name: response.data.name,
          price: response.data.price,
          quantity: response.data.quantity,
          old_image: response.data.image,
        });

        toast.success("Product details loaded successfully!");
      } catch (error) {
        toast.error("Unable to fetch product details. Please try again.");
      } finally {
        setIsLoading(false); // Stop loading state
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {}; // Initialize validation errors object

    // Validate form fields
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.price || formData.price <= 0) errors.price = "Price must be a positive number.";
    if (!formData.quantity || formData.quantity < 0) errors.quantity = "Quantity must be a non-negative number.";

    // If there are validation errors, update state and stop submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.warn("Please fix the validation errors before submitting.");
      return;
    }

    // Create FormData object for API request
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("quantity", formData.quantity);
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }
    formDataObj.append("old_image", formData.old_image);

    try {
      // Send PUT request to update product
      await axios.put(`http://localhost:5000/api/products/${id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success toast for 2 seconds
      toast.success("Product updated successfully!", {
        autoClose: 2000, // 2 seconds
      });

      navigate("/admin/products"); // Redirect to product list
    } catch (error) {
      toast.error("Unable to update the product. Please try again.");
    }
  };

  // Show loading indicator while fetching product data
  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4 rounded">
            <h2 className="text-center mb-5 text-success">Edit Item</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
              {/* Item Name Input */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Item Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
                {validationErrors.name && <div className="text-danger">{validationErrors.name}</div>}
              </div>

              {/* Price Input */}
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                />
                {validationErrors.price && <div className="text-danger">{validationErrors.price}</div>}
              </div>

              {/* Quantity Input */}
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                {validationErrors.quantity && <div className="text-danger">{validationErrors.quantity}</div>}
              </div>

              {/* Image Upload */}
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Select Image</label>
                <input
                  className="form-control"
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
                {/* Show current product image */}
                {formData.old_image && (
                  <img
                    src={`${baseURL}${formData.old_image}`}
                    width="100"
                    className="img-thumbnail mt-1"
                    alt="Current"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <button type="submit" className="btn btn-success w-100 py-2 shadow">
                    Update Item
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
      {/* Toast Container to display notifications */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};

export default EditProduct;
