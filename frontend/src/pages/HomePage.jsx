import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-pink-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Sibgha Collection
        </h1>
        <p className="text-xl mb-8">
          Discover the latest ladies fashion collection
        </p>
        <Link
          to="/products"
          className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 text-lg"
        >
          Shop Now
        </Link>
      </div>

      {/* Categories Section */}
      <div className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {["Dresses", "Shirts", "Pants", "Accessories"].map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat.toLowerCase()}`}
              className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition hover:bg-pink-50"
            >
              <p className="text-lg font-bold text-pink-600">{cat}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome User Section */}
      {user && (
        <div className="text-center py-6">
          <p className="text-gray-600 text-lg">
            Welcome back,{" "}
            <span className="text-pink-600 font-bold">{user.name}</span>!
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
