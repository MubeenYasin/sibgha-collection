import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
//   const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Access denied. Admin only!</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Show preview
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Use FormData to send files
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      // Add each image
      images.forEach((image) => {
        data.append("images", image);
      });

      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product created successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      setImages([]);
      setPreviews([]);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
          Create New Product
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
              placeholder="Enter product description"
              rows="3"
              required
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
              required
            >
              <option value="">Select category</option>
              <option value="shirts">Shirts</option>
              <option value="pants">Pants</option>
              <option value="dresses">Dresses</option>
              <option value="accessories">Accessories</option>
              <option value="shoes">Shoes</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-pink-500"
            />

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`preview-${index}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
