import { useEffect, useState, useContext } from "react"; 
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export default function ProductList() {
  const { user, dispatch } = useContext(AuthContext); // Access user authentication context
  const [products, setProducts] = useState([]); // State to hold products list
  const baseURL = "http://localhost:5000/uploads/"; // Base URL for product images

  // Axios instance for API requests with authentication header
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${user}`, // Attach user token for authentication
    },
  });

  // Fetch products from API
  const getProducts = async () => {
    try {
      const response = await axiosInstance.get("/products?_sort=id&_order=asc"); // Fetch products sorted by ID
      setProducts(response.data); // Update state with retrieved products
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Unable to get data. Please try again."); // Show error notification
    }
  };

  // Delete a product by ID
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return; // Exit function if user cancels deletion
    }

    try {
      const response = await axiosInstance.delete(`/products/${id}`); // Send DELETE request
      if (response.status === 200) {
        toast.success("Product deleted successfully."); // Show success notification
        getProducts(); // Refresh product list after deletion
      } else {
        toast.error("Failed to delete the product. Try again later."); // Show error notification
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response && error.response.status === 404) {
        toast.warn("Product not found. It may have already been deleted."); // Handle case where product is already deleted
      } else {
        toast.error("Unable to delete the product. Please try again later.");
      }
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="container my-4">
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
          {/* Loop through products and display each row */}
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{"Rs. " + product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <img
                  src={`${baseURL}${product.image}`} // Show product image
                  width="100px"
                  height="90px"
                  alt={product.name}
                />
              </td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                {/* Edit button - navigates to edit product page */}
                <Link
                  className="btn btn-primary btn-sm me-1"
                  to={`/admin/products/edit/${product._id}`}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                  }}
                >
                  Edit
                </Link>
                {/* Delete button - calls deleteProduct function */}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(product._id)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                  }}
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
