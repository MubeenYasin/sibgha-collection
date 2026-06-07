import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      // even if api fails - clear local storage and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav className="bg-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold">
        Sibgha Collection 🛍️
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/products" className="hover:underline">
          Products
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link to="/admin/create-product" className="hover:underline">
                Add Product
              </Link>
            )}
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
            <Link to="/login" className="hover:underline">
              Login
            </Link>
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
