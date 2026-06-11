import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import toast from "react-hot-toast";
import ReviewSection from "../components/ReviewSection";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-pink-600 text-xl">Loading...</div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500 text-xl">{error}</div>
    );

  const handleDelete = async () => {
    // Ask for confirmation first
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);
      navigate("/products");
    } catch {
      setError("Failed to delete product");
    }
  };

  //  handleAddToCart function
  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success("Added to cart!");
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
      toast.success("Removed from wishlist!");
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        toast.success("Added to wishlist!");
      } else {
        toast.error(result.message || "Failed to add to wishlist");
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Left - Images */}
          <div>
            {/* Main Image */}
            <img
              src={
                product.images[selectedImage] ||
                "https://placehold.co/400x400?text=No+Image"
              }
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />

            {/* wishlist button */}
            <button
              onClick={handleWishlist}
              className={`flex items-center gap-2 mt-2 px-4 py-2 rounded-lg border ${
                isInWishlist(product?._id)
                  ? "bg-red-50 border-red-300 text-red-500"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-pink-50"
              }`}
            >
              <Heart
                size={20}
                fill={isInWishlist(product?._id) ? "currentColor" : "none"}
              />
              {isInWishlist(product?._id) ? "Wishlisted" : "Add to Wishlist"}
            </button>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 
                                            ${selectedImage === index ? "border-pink-600" : "border-gray-200"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Details */}
          <div>
            {/* Category Badge */}
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-800 mt-3">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-pink-600 mt-3">
              Rs. {product.price}
            </p>

            {/* Stock */}
            <p
              className={`mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>

            {/* Divider */}
            <hr className="my-4" />

            {/* Description */}
            <h3 className="font-bold text-gray-700 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Divider */}
            <hr className="my-4" />

            {/* Add to Cart Section */}
            {user && user.role !== "admin" && (
              <div className="mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-gray-700 font-medium">Quantity:</label>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="bg-gray-200 w-8 h-8 rounded-full hover:bg-gray-300 font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="bg-gray-200 w-8 h-8 rounded-full hover:bg-gray-300 font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 font-bold"
                >
                  {cartLoading ? "Adding..." : "Add to Cart 🛒"}
                </button>
              </div>
            )}

            {/* Admin Buttons */}
            {user && user.role === "admin" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Edit Product
                </button>
                {/* delete product */}
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                  Delete Product
                </button>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={() => navigate("/products")}
              className="mt-4 text-pink-600 hover:underline flex items-center gap-1"
            >
              ← Back to Products
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-8 pb-8">
          <ReviewSection productId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
