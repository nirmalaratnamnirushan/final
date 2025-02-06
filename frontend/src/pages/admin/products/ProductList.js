import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductList() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const baseURL = "http://localhost:5000/uploads/";

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${user}`,
    },
  });

  // Fetch products from API
  const getProducts = async () => {
    try {
      const response = await axiosInstance.get("/products?_sort=id&_order=asc");
      setProducts(response.data);

      // Show toast only once using a unique toastId
      toast.dismiss();
      toast.success("Products loaded successfully!", { toastId: "product-load" });
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Unable to get data. Please try again.");
    }
  };

  // Delete product with toast confirmation
  const deleteProduct = async (id) => {
    // Show a toast confirmation message with action buttons
    toast.warn(
      <div>
        <p>Are you sure you want to delete this product?</p>
        <button
          className="btn btn-danger btn-sm me-2"
          onClick={() => confirmDelete(id)}
        >
          Yes, Delete
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => toast.dismiss()}
        >
          Cancel
        </button>
      </div>,
      {
        position: "top-center",
        autoClose: false, // Keep open until user interacts
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  // Actual delete function
  const confirmDelete = async (id) => {
    toast.dismiss(); // Close the confirmation toast
    try {
      const response = await axiosInstance.delete(`/products/${id}`);
      if (response.status === 200) {
        toast.success("Product deleted successfully.");
        getProducts(); // Refresh list
      } else {
        toast.error("Failed to delete the product. Try again later.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response && error.response.status === 404) {
        toast.warn("Product not found. It may have already been deleted.");
      } else {
        toast.error("Unable to delete the product. Please try again later.");
      }
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container my-4">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{"Rs. " + product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <img src={`${baseURL}${product.image}`} width="100px" height="90px" alt={product.name} />
              </td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <Link
                  className="btn btn-primary btn-sm me-1"
                  to={`/admin/products/edit/${product._id}`}
                  style={{ padding: "10px 20px", fontSize: "14px" }}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(product._id)}
                  style={{ padding: "10px 20px", fontSize: "14px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
