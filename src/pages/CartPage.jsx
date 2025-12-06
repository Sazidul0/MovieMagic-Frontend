import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, removeFromCart, updateCartItem, checkoutCart, clearCart } from "../services/api";
import { Trash2, Plus, Minus, ShoppingCart, ChevronLeft, Clock, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

const CartPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, []); // Empty dependency array - only run once on mount

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getCart();
      
      // Handle both populated and unpopulated responses
      const cartData = data.cart || { items: [], totalCartPrice: 0 };
      
      setCart(cartData);
      setSelectedItems(cartData.items?.map(item => item._id) || []);
      
      // Dispatch event to update cart count in navbar
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: cartData.items?.length || 0 }
        })
      );
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      
      // Check if it's a backend connection error
      if (err.message.includes('Network error') || err.message.includes('Backend')) {
        setError("⚠️ Backend server is not running. Please ensure the backend is started on http://localhost:5000");
      } else {
        setError(err.message || "Failed to load cart. Please try again.");
      }
      
      // Set empty cart on error
      setCart({ items: [], totalCartPrice: 0 });
      setSelectedItems([]);
      
      // Dispatch zero count event
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: 0 }
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId),
        totalCartPrice: prev.totalCartPrice - (prev.items.find(i => i._id === itemId)?.totalPrice || 0)
      }));
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } catch (err) {
      setError("Failed to remove item from cart.");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) return;

    try {
      await clearCart();
      setCart({ items: [], totalCartPrice: 0 });
      setSelectedItems([]);
    } catch (err) {
      setError("Failed to clear cart.");
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      setError("Please select at least one item to checkout.");
      return;
    }

    try {
      setCheckingOut(true);
      setError("");
      const response = await checkoutCart(selectedItems);

      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#ec4899", "#22d3ee", "#fbbf24"],
      });

      // Update cart count to 0
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { count: 0 }
        })
      );

      setCart(response.remainingCart || { items: [], totalCartPrice: 0 });
      setSelectedItems(response.remainingCart?.items?.map(item => item._id) || []);

      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading your cart...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment while fetching movie details</p>
        </div>
      </div>
    );
  }

  const cartTotal = selectedItems.reduce((sum, itemId) => {
    const item = cart?.items?.find(i => i._id === itemId);
    return sum + (item?.totalPrice || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/movies" className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-4">
            <ChevronLeft className="w-5 h-5" /> Continue Shopping
          </Link>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400 flex items-center gap-3">
            <ShoppingCart className="w-10 h-10" /> Your Cart
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchCart}
                className="text-xs mt-2 px-3 py-1 bg-red-600/40 hover:bg-red-600/60 rounded flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          </div>
        )}

        {!cart?.items || cart.items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-20 h-20 mx-auto text-gray-600 mb-4" />
            <p className="text-2xl text-gray-300 mb-2">Your cart is empty</p>
            {error && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 inline-block mt-4 max-w-md">
                <p className="text-sm text-yellow-300">{error}</p>
              </div>
            )}
            {!error && <p className="text-gray-400 mb-6">Start adding movies to your cart!</p>}
            <Link
              to="/movies"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all mt-6"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="bg-black/40 rounded-2xl p-4 border border-purple-500/30 hover:border-purple-500/60 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          className="w-6 h-6 mt-2 cursor-pointer rounded border-purple-500"
                        />

                        {/* Movie Poster */}
                        <img
                          src={item.movie?.posterUrl || "https://via.placeholder.com/80x120?text=No+Image"}
                          alt={item.movie?.title}
                          className="w-20 h-28 rounded-lg object-cover"
                        />

                        {/* Item Details */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {typeof item.movie === 'object' && item.movie?.title 
                              ? item.movie.title 
                              : `Movie (ID: ${typeof item.movie === 'string' ? item.movie : item.movie?._id || 'Unknown'})`
                            }
                          </h3>
                          <div className="space-y-1 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-pink-400" />
                              {new Date(item.bookingDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-pink-400" />
                              {item.showtime}
                            </div>
                            <div className="text-white font-semibold mt-2">
                              Seats: <span className="text-cyan-400">{item.seats.join(", ")}</span>
                            </div>
                            <div className="text-white font-semibold mt-2">
                              Price per Seat: <span className="text-yellow-400">${item.pricePerSeat}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Remove */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400 mb-4">
                            ${item.totalPrice}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full mt-6 py-2 text-red-400 hover:text-red-300 border border-red-400/50 hover:border-red-400 rounded-lg transition-colors"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-white/20">
                  <div className="flex justify-between text-gray-300">
                    <span>Items Selected</span>
                    <span className="font-bold">{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span className="font-bold">${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax (0%)</span>
                    <span className="font-bold">$0</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-bold mb-8 text-yellow-400">
                  <span>Total</span>
                  <span>${cartTotal}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0 || checkingOut}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {checkingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Proceed to Checkout
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-400 text-center mt-4">
                  {selectedItems.length === 0
                    ? "Select items to checkout"
                    : `${selectedItems.length} item${selectedItems.length !== 1 ? "s" : ""} selected`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
