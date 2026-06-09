import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav className="bg-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">
        Sibgha Collection 🛍️
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/products" className="hover:underline">Products</Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link to="/admin/create-product" className="hover:underline">
                Add Product
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:underline">
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-white text-pink-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <span>Hello, {user.name}!</span>
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
    </nav>
  );
};

export default Navbar;