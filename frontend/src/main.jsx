import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#fff",
                color: "#333",
              },
              success: {
                style: {
                  border: "1px solid #ec4899",
                  color: "#ec4899",
                },
              },
              error: {
                style: {
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                },
              },
            }}
          />
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
