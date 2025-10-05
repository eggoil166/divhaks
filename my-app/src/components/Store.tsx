import React, { useState } from "react";
import Alert from "./Alert";

export default function Store() {
  const [points, setPoints] = useState(25);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const items = [
    { name: "Chips", source: "/chips.png", points: 5 },
    { name: "Strawberry", source: "/strawberry.webp", points: 7 },
    { name: "Red Bull", source: "/redbull.jpg", points: 10 },
    { name: "Sugar Cookies", source: "/sugar-cookie.png", points: 15 },
    {
      name: "Steak",
      source:
        "https://www.kindpng.com/picc/m/434-4344308_steak-meat-png-cooked-meat-transparent-background-png.png",
      points: 25,
    },
  ];

  const handleRedeem = (cost: number, name: string) => {
    if (points >= cost) {
      setPoints((prev) => prev - cost);
      setAlertMessage(`You bought the item successfully! 🎉`);
      setAlertVisible(true);
    } else {
      // do nothing — no alert for failure
      console.log("Not enough points");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text)] pt-28 pb-10 px-6 lg:px-10">
      {/* Success Alert */}
      <Alert
        show={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      {/* Banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] p-6 text-center shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Store
        </h1>
      </div>

      {/* Tagline */}
      <div className="text-center mb-12">
        <p className="text-2xl sm:text-3xl font-semibold opacity-90">
          Bring your kitty a treat!
        </p>
        <p className="mt-4 text-lg font-medium">
          You have{" "}
          <span className="text-blue-500 font-semibold">{points}</span> points.
        </p>
      </div>

      {/* Items */}
      <div className="bg-blue-500/30 backdrop-blur-md rounded-xl p-8 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {items.map((item, index) => {
            const canAfford = points >= item.points;
            return (
              <div
                key={index}
                className="relative bg-white/70 rounded-lg px-6 pt-6 pb-12 text-center shadow-md flex flex-col items-center"
              >
                <div className="text-xl font-semibold opacity-90 mb-4">
                  {item.name}
                </div>
                <img
                  src={item.source}
                  alt={item.name}
                  className="w-24 h-24 object-contain mb-4"
                />
                <div className="absolute bottom-3">
                  <button
                    onClick={() => handleRedeem(item.points, item.name)}
                    disabled={!canAfford}
                    className={`px-4 py-1 rounded-full text-white text-sm shadow-md border border-white/20 focus:outline-none focus:ring-2 transition-all ${
                      canAfford
                        ? "bg-gradient-to-br from-green-400 to-green-600 hover:scale-105 focus:ring-green-300"
                        : "bg-gray-400 cursor-not-allowed opacity-60"
                    }`}
                  >
                    ({item.points} pts)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
