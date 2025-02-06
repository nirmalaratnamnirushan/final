import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
    old_image: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const baseURL = "http://localhost:5000/uploads/";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
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
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.price || formData.price <= 0) errors.price = "Price must be a positive number.";
    if (!formData.quantity || formData.quantity < 0) errors.quantity = "Quantity must be a non-negative number.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.warn("Please fix the validation errors before submitting.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("quantity", formData.quantity);
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }
    formDataObj.append("old_image", formData.old_image);

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!", { autoClose: 2000 });

      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (error) {
      toast.error("Unable to update the product. Please try again.");
    }
  };

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
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};

export default EditProduct;
