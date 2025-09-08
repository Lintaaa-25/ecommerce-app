import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;
    try {
      await API.put(`/cart/update/${cartId}`, { quantity: newQty });
      fetchCart(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (cartId) => {
    try {
      await API.delete(`/cart/remove/${cartId}`);
      fetchCart(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.Item.price,
    0
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-xl shadow"
            >
              <img
                src={`${API.defaults.baseURL}${item.Item.image}`}
                alt={item.Item.name}
                className="w-24 h-24 object-cover rounded-md mr-4"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.Item.name}</h3>
                <p className="text-gray-500 mb-2">₹{item.Item.price}</p>

                {/* Quantity selector */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.id)}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total */}
          <div className="text-right mt-4 text-xl font-bold">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
