import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    category: "",
    price: "",
    description: "",
  });

  const [bookings, setBookings] = useState([]);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fetchProducts = () => {
    axios
      .get(`${API}/products`)
      .then((res) => setProducts(res.data))
      .catch(() => showPopupMessage("Failed to load products"));
  };

  const fetchBookings = () => {
    axios
      .get(`${API}/bookings`)
      .then((res) => setBookings(res.data))
      .catch(() => showPopupMessage("Failed to load bookings"));
  };

  useEffect(() => {
    fetchProducts();
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      await axios.post(`${API}/add-product`, data);
      setFormData({
        name: "",
        image: null,
        category: "",
        price: "",
        description: "",
      });
      fetchProducts();
      showPopupMessage("Product added successfully!");
    } catch {
      showPopupMessage("Failed to add product.");
    }
  };

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const confirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowModal("product");
  };

  const confirmBookingDelete = (bookingId) => {
    setBookingToDelete(bookingId);
    setShowModal("booking");
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`${API}/delete-product/${productToDelete}`);
      fetchProducts();
    } catch {
      showPopupMessage("Failed to delete product.");
    } finally {
      setShowModal(false);
      setProductToDelete(null);
    }
  };

  const deleteBooking = async () => {
    try {
      await axios.delete(`${API}/delete-booking/${bookingToDelete}`);
      fetchBookings();
    } catch {
      showPopupMessage("Failed to delete booking.");
    } finally {
      setShowModal(false);
      setBookingToDelete(null);
    }
  };

  return (
    <div>
      <section className="product-form">
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Footwear">Footwear</option>
              <option value="Clothing">Clothing</option>
              <option value="Beauty">Beauty</option>
              <option value="Home-Essentials">Home-Essentials</option>
              <option value="Bags">Bags</option>
              <option value="Gift Items">Gift Items</option>
              <option value="Jewelry">Jewelry</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </section>

      <div className="toggle-buttons">
        <button
          className={view === "products" ? "active" : ""}
          onClick={() => setView("products")}
        >
          Products
        </button>
        <button
          className={view === "bookings" ? "active" : ""}
          onClick={() => setView("bookings")}
        >
          Bookings
        </button>
      </div>

      {view === "products" && (
        <section className="product-list">
          <h2>Product List</h2>
          {products.length === 0 ? (
            <p>No products yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img src={p.image} width="60" />
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price}</td>
                    <td>{p.description}</td>
                    <td>
                      <button
                        className="btn-red"
                        onClick={() => confirmDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {view === "bookings" && (
        <section className="booking-table">
          <h2>User Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.product_name}</td>
                    <td>{b.category}</td>
                    <td>{b.phone}</td>
                    <td>{new Date(b.created_at).toLocaleString()}</td>
                    <td>
                      <button onClick={() => confirmBookingDelete(b.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              {showModal === "product"
                ? "Are you sure you want to delete this product?"
                : "Are you sure you want to delete this booking?"}
            </p>
            <div className="modal-buttons">
              <button
                onClick={
                  showModal === "product" ? deleteProduct : deleteBooking
                }
              >
                Yes, Delete
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification popup */}
      {showPopup && <div className="popup-notification">{popupMessage}</div>}
    </div>
  );
};

export default Dashboard;
