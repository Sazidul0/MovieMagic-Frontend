// src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate, Link } from "react-router-dom";
import { getMovieById, addToCart, getBookedSeats } from "../services/api";
import { Calendar, Clock, Ticket, ChevronLeft, AlertCircle, X, ShoppingCart } from "lucide-react";
import confetti from "canvas-confetti";

const BookingPage = () => {
  const { id: movieId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);

  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const seatsPerRow = 12;
  const aisleAfter = 6;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieById(movieId);
        setMovie(data);

        if (data.showtimes?.length > 0) {
          const first = data.showtimes[0];
          setSelectedDate(first.date);
          setSelectedTime(first.time);
        }
      } catch (err) {
        setError("Failed to load movie.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;

    const fetchBookedSeats = async () => {
      try {
        const seats = await getBookedSeats(movieId, selectedDate, selectedTime);
        setBookedSeats(seats || []);
        setSelectedSeats([]);
      } catch (err) {
        console.error("Failed to fetch booked seats:", err);
        setBookedSeats([]);
      }
    };

    fetchBookedSeats();
  }, [movieId, selectedDate, selectedTime]);

  const getSeatLabel = (rowIdx, seatNum) => {
    const adjusted = seatNum > aisleAfter ? seatNum - 1 : seatNum;
    return `${rows[rowIdx]}${adjusted}`;
  };

  const handleSeatClick = (seatLabel) => {
    if (bookedSeats.includes(seatLabel)) return;

    setSelectedSeats(prev =>
      prev.includes(seatLabel)
        ? prev.filter(s => s !== seatLabel)
        : [...prev, seatLabel]
    );
  };

 // In your BookingPage.jsx → replace the handleBooking function with this:
const handleBooking = async () => {
  if (selectedSeats.length === 0) {
    setError("Please select at least one seat!");
    return;
  }

  const seatPrice = 15; // Price per seat
  const cartData = {
    movie: movie._id,
    bookingDate: selectedDate,
    showtime: selectedTime,
    seats: selectedSeats,
    pricePerSeat: seatPrice,
  };

  try {
    setError("");
    const response = await addToCart(cartData);

    // Dispatch event to update cart count in navbar
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { count: response.cart?.items?.length || 0 }
      })
    );

    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#a78bfa", "#ec4899", "#22d3ee", "#fbbf24"],
    });

    setTimeout(() => navigate("/cart"), 1000);
  } catch (err) {
    console.error("Add to cart error:", err);
    setError(err.message || "Failed to add to cart. Try again.");
  }
};
  if (!user) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-3xl text-white animate-pulse">Loading showtime...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <p className="text-2xl text-red-400">{error || "Movie not found"}</p>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * 15;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link to={`/movie/${movieId}`} className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8">
          <ChevronLeft /> Back to Movie
        </Link>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-10 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
            {movie.title}
          </h1>
          <div className="flex justify-center gap-8 text-gray-300">
            <span><Clock className="inline w-5 h-5" /> {movie.duration}</span>
            <span><Ticket className="inline w-5 h-5" /> $15 per seat</span>
          </div>
        </div>

        {/* Showtime Selector */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Select Showtime</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {movie.showtimes?.map((slot) => {
              const isActive = selectedDate === slot.date && selectedTime === slot.time;
              const dateStr = new Date(slot.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              return (
                <button
                  key={`${slot.date}-${slot.time}`}
                  onClick={() => {
                    setSelectedDate(slot.date);
                    setSelectedTime(slot.time);
                  }}
                  className={`px-10 py-6 rounded-2xl text-lg font-bold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 ring-4 ring-purple-400/50 shadow-2xl"
                      : "bg-white/10 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <div>{dateStr}</div>
                  <div className="text-2xl">{slot.time}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Screen */}
        <div className="text-center mb-10">
          <div className="inline-block px-32 py-6 bg-gradient-to-b from-gray-800 to-black rounded-t-full shadow-2xl border-t-8 border-purple-600 text-2xl font-bold">
            SCREEN
          </div>
        </div>

        {/* Seat Map */}
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-10 mb-32">
          <div className="space-y-6">
            {rows.map((row, rIdx) => (
              <div key={row} className="flex items-center justify-center gap-3">
                <span className="w-10 text-xl font-bold text-purple-400">{row}</span>
                <div className="flex gap-3">
                  {Array.from({ length: seatsPerRow }).map((_, i) => {
                    const seatNum = i + 1;
                    if (seatNum === aisleAfter + 1) return <div key="aisle" className="w-16" />;

                    const label = getSeatLabel(rIdx, seatNum);
                    const isBooked = bookedSeats.includes(label);
                    const isSelected = selectedSeats.includes(label);

                    return (
                      <button
                        key={label}
                        onClick={() => handleSeatClick(label)}
                        disabled={isBooked}
                        className={`relative w-12 h-12 rounded-lg font-bold transition-all hover:scale-110 ${
                          isBooked
                            ? "bg-red-900/80 cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-br from-pink-500 to-purple-600 ring-4 ring-purple-400 shadow-lg"
                            : "bg-gray-700 hover:bg-cyan-600"
                        }`}
                      >
                        {seatNum > aisleAfter ? seatNum - 1 : seatNum}
                        {isBooked && <X className="w-6 h-6 absolute inset-0 m-auto text-white" />}
                      </button>
                    );
                  })}
                </div>
                <span className="w-10 text-xl font-bold text-purple-400">{row}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-10 mt-10 text-sm">
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-700 rounded"></div> Available</div>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded ring-4 ring-purple-400"></div> Selected</div>
            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-red-900/80 rounded relative"><X className="w-5 h-5 absolute inset-0 m-auto text-white" /></div> Booked</div>
          </div>
        </div>

        {/* Floating Summary */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50">
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/30">
            {error && <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-center">{error}</div>}

            <h3 className="text-2xl font-bold text-center mb-4"></h3>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between"><span>Seats</span><span className="font-bold text-cyan-400">{selectedSeats.join(", ") || "None"}</span></div>
              <div className="flex justify-between"><span>Showtime</span><span className="font-bold">{selectedDate && new Date(selectedDate).toLocaleDateString()} {selectedTime}</span></div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-white/20">
                <span>Total</span>
                <span className="text-yellow-400">${totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedSeats.length}
              className="w-full mt-6 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {selectedSeats.length ? `Add to Cart - $${totalPrice}` : "Select Seats First"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;