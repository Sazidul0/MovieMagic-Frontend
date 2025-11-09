import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { movies } from "../data/movies";
import { Calendar, Clock, MapPin, Ticket, ChevronLeft, X, Check } from "lucide-react";
import confetti from "canvas-confetti";

const BookingPage = () => {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Mock showtimes with dates
  const showtimes = [
    { date: "2025-11-10", time: "10:00 AM" },
    { date: "2025-11-10", time: "1:30 PM" },
    { date: "2025-11-10", time: "4:45 PM" },
    { date: "2025-11-11", time: "7:30 PM" },
    { date: "2025-11-11", time: "10:15 PM" },
  ];

  // Seat layout: Rows A-F, 12 seats per row, aisle in middle
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 12;
  const aisleStart = 5; // seats 6-7 are aisle

  const bookedSeats = [3, 15, 27, 40, 52]; // Mock booked

  useEffect(() => {
    if (showtimes.length > 0) {
      setSelectedDate(showtimes[0].date);
      setSelectedTime(showtimes[0].time);
    }
  }, []);

  if (!user) return <Navigate to="/login" />;
  if (!movie) return <Navigate to="/movies" />;

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      alert(
        `Booking confirmed!\nMovie: ${movie.title}\nDate: ${selectedDate}\nTime: ${selectedTime}\nSeats: ${selectedSeats
          .map(getSeatLabel)
          .join(", ")}\nTotal: $${selectedSeats.length * 15}`
      );
      // Reset
      setSelectedSeats([]);
    }, 500);
  };

  const getSeatLabel = (seatId) => {
    const rowIndex = Math.floor(seatId / seatsPerRow);
    const seatNum = (seatId % seatsPerRow) + 1;
    return `${rows[rowIndex]}${seatNum}`;
  };

  const getSeatId = (row, num) => row * seatsPerRow + (num - 1);

  const totalPrice = selectedSeats.length * 15;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Movie
          </Link>
          <div className="text-sm text-gray-400">
            Logged in as <span className="font-semibold text-white">{user.name}</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-10 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-32 h-48 rounded-xl shadow-xl object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
                {movie.title}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Cinema Hall 1
                </span>
                <span className="badge badge-outline border-cyan-400 text-cyan-400">
                  {movie.format || "2D"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Showtime Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Select Showtime</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["2025-11-10", "2025-11-11", "2025-11-12"].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  selectedDate === date
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                }`}
              >
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {showtimes
              .filter((s) => s.date === selectedDate)
              .map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    selectedTime === slot.time
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-xl"
                      : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  {slot.time}
                </button>
              ))}
          </div>
        </div>

        {/* Theater Screen */}
        <div className="text-center mb-8">
          <div className="inline-block px-20 py-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-full shadow-2xl border-t-4 border-x-4 border-gray-600">
            <p className="text-xl font-bold text-gray-300">SCREEN</p>
          </div>
          <div className="h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>

        {/* Seat Layout */}
        <div className="bg-black/40 backdrop-blur-sm rounded-3xl p-8 mb-10 border border-white/10">
          <div className="space-y-4">
            {rows.map((row, rowIndex) => (
              <div key={row} className="flex items-center justify-center gap-2">
                <span className="w-8 text-right font-bold text-gray-400">{row}</span>
                <div className="flex gap-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatNum = i + 1;
                    const seatId = getSeatId(rowIndex, seatNum);
                    const isAisle = seatNum === aisleStart || seatNum === aisleStart + 1;
                    const isSelected = selectedSeats.includes(seatId);
                    const isBooked = bookedSeats.includes(seatId);

                    if (isAisle) {
                      return <div key={`aisle-${seatNum}`} className="w-10" />;
                    }

                    return (
                      <button
                        key={seatId}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isBooked}
                        className={`relative w-10 h-10 rounded-lg font-medium text-xs transition-all duration-300 transform hover:scale-110 ${
                          isBooked
                            ? "bg-red-900/70 cursor-not-allowed"
                            : isSelected
                            ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl ring-4 ring-purple-400/50"
                            : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-cyan-600 hover:to-purple-600 text-gray-300 shadow-md"
                        }`}
                      >
                        {seatNum}
                        {isBooked && <X className="w-4 h-4 absolute inset-0 m-auto text-red-400" />}
                        {isSelected && <Check className="w-4 h-4 absolute inset-0 m-auto" />}
                      </button>
                    );
                  })}
                </div>
                <span className="w-8 text-left font-bold text-gray-400">{row}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-900/70 rounded relative">
                <X className="w-4 h-4 absolute inset-0 m-auto text-red-400" />
              </div>
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* Floating Booking Summary */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <div className="bg-white/20 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/30">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Ticket className="w-6 h-6 text-yellow-400" />
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Selected Seats:</span>
                <span className="font-semibold">
                  {selectedSeats.length > 0 ? selectedSeats.map(getSeatLabel).join(", ") : "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Showtime:</span>
                <span className="font-semibold">
                  {selectedDate} • {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/20">
                <span>Total:</span>
                <span className="text-yellow-400">${totalPrice}</span>
              </div>
            </div>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="w-full mt-4 btn btn-lg rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              Confirm & Pay ${totalPrice}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;