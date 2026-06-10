import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/");
    }
    setMenuOpen(false)
  };

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-pink-600 text-white px-6 py-4 shadow-md">

      {/* Top Bar */}
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold" onClick={closeMenu}>
          Sibgha Collection
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/products" className="hover:underline">Products</Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === "admin" && (
                <>
                  <Link to="/admin/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                  <Link to="/admin/create-product" className="hover:underline">
                    Add Product
                  </Link>
                </>
              )}

              {/* Cart Icon */}
              <Link to="/cart" className="relative">
                <ShoppingCart size={26} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="hover:underline">
                Hello, {user.name}!
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-pink-600 px-4 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="hover:underline">Login</Link>
              <Link
                to="/register"
                className="bg-white text-pink-600 px-4 py-1 rounded hover:bg-gray-100"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-4">
          {user && (
            <Link to="/cart" className="relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-pink-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Hamburger Button */}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 border-t border-pink-500 pt-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="hover:bg-pink-700 px-3 py-2 rounded"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={closeMenu}
            className="hover:bg-pink-700 px-3 py-2 rounded"
          >
            Products
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMenu}
                    className="hover:bg-pink-700 px-3 py-2 rounded"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/create-product"
                    onClick={closeMenu}
                    className="hover:bg-pink-700 px-3 py-2 rounded"
                  >
                    Add Product
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                onClick={closeMenu}
                className="hover:bg-pink-700 px-3 py-2 rounded"
              >
                Hello, {user.name}!
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white text-pink-600 px-4 py-2 rounded hover:bg-gray-100 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="hover:bg-pink-700 px-3 py-2 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-white text-pink-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;