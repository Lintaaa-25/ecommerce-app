import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Items() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await API.get(`/items?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category, minPrice, maxPrice]);

  const addToCart = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await API.post(
        "/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Item added to cart");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Products</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded-md w-full"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length === 0 ? (
          <p className="text-gray-600 col-span-full">No items found</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`} // add your backend URL
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 mb-2">{item.category}</p>
              <p className="font-bold text-gray-800 mb-4">₹{item.price}</p>
              <button
                onClick={() => addToCart(item.id)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
