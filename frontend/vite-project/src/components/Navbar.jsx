import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1
            className="text-2xl font-extrabold text-blue-600 cursor-pointer"
            onClick={() => navigate("/items")}
          >
            E-Shop
          </h1>
          <span className="text-sm text-gray-500">Mini e-commerce</span>
        </div>

        <nav className="flex items-center gap-4">
          <Link className="text-gray-700 hover:text-blue-600" to="/items">Products</Link>
          <Link className="text-gray-700 hover:text-blue-600" to="/cart">Cart</Link>

          {!token ? (
            <>
              <Link className="text-gray-700 hover:text-blue-600" to="/signup">Signup</Link>
              <Link className="text-gray-700 hover:text-blue-600" to="/login">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
