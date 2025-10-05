import React, { useRef, useState } from "react";
import Alert from "./Alert";

export default function Store() {
  const [points, setPoints] = useState(25);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 🦁 Lion anchor
  const lionRef = useRef<HTMLDivElement | null>(null);

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

  // Keep refs to each item image
  const imgRefs = useRef<Record<number, HTMLImageElement | null>>({});

  // lightweight, dependency-free confetti
  const spawnConfetti = (x: number, y: number) => {
    const colors = ["#60a5fa", "#f472b6", "#34d399", "#f59e0b", "#a78bfa"];
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "9999",
    } as CSSStyleDeclaration);
    document.body.appendChild(container);

    const N = 36;
    for (let i = 0; i < N; i++) {
      const p = document.createElement("div");
      const size = 6 + Math.random() * 8;
      Object.assign(p.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: colors[i % colors.length],
        opacity: "0.9",
        transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      } as CSSStyleDeclaration);

      const dx = (Math.random() - 0.5) * 240;
      const dy = -(80 + Math.random() * 160);
      const rot = (Math.random() - 0.5) * 720;

      p.animate(
        [
          { transform: `translate(-50%, -50%) rotate(0deg)`, opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 },
        ],
        { duration: 1000 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
      );

      container.appendChild(p);
    }

    setTimeout(() => container.remove(), 1400);
  };

  // clone clicked image and fly to lion
  const flyImageToLion = (imgEl: HTMLImageElement | null) => {
    const lionEl = lionRef.current;
    if (!imgEl || !lionEl) return;

    const imgRect = imgEl.getBoundingClientRect();
    const lionRect = lionEl.getBoundingClientRect();

    const ghost = imgEl.cloneNode(true) as HTMLImageElement;
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${imgRect.left}px`,
      top: `${imgRect.top}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
      zIndex: "9999",
      pointerEvents: "none",
      transition: "transform 650ms cubic-bezier(.2,.9,.2,1), opacity 650ms ease",
    } as CSSStyleDeclaration);
    document.body.appendChild(ghost);

    const startX = imgRect.left + imgRect.width / 2;
    const startY = imgRect.top + imgRect.height / 2;
    const endX = lionRect.left + lionRect.width / 2;
    const endY = lionRect.top + lionRect.height / 2;

    const translateX = endX - startX;
    const translateY = endY - startY;

    requestAnimationFrame(() => {
      ghost.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.6) rotate(${(Math.random()-0.5)*40}deg)`;
      ghost.style.opacity = "0.7";
    });

    setTimeout(() => {
      spawnConfetti(endX, endY);
      ghost.remove();
      lionEl.classList.add("lion-chew");
      setTimeout(() => lionEl.classList.remove("lion-chew"), 400);
    }, 680);
  };
  const successMessages = [
    "Great choice! Your kitty is so happy with the treat! 🐾",
    "The lion loved that snack. You’re doing awesome! 🦁",
    "Another reward unlocked — keep going, you’re crushing it! 🌟",
    "Small wins lead to big victories. Proud of you! 💪",
    "Your kitty is purring with joy. Stay motivated! 😺",
  ];


  const handleRedeem = (cost: number, name: string, index: number) => {
    if (points >= cost) {
      setPoints((prev) => prev - cost);
      // choose a random motivational message
      const msg = successMessages[Math.floor(Math.random() * successMessages.length)];
      setAlertMessage(msg);
      setAlertVisible(true);
      flyImageToLion(imgRefs.current[index] || null);
    } else {
      setAlertMessage("Not enough points. Keep collecting points! 💪");
      setAlertVisible(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text)] pt-28 pb-10 px-6 lg:px-10 relative">
      {/* fixed lion on the left bottom */}
      <div
        ref={lionRef}
        className="hidden lg:block pointer-events-none select-none fixed left-6 bottom-40 w-64 h-64 grid place-items-center"
      >
        <img
          src="/baby-lion.webp"
          alt="Lion assistant"
          className="w-full h-full object-contain drop-shadow"
        />
      </div>
      {/* Success Alert */}
      <Alert
        show={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      {/* Banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] p-6 text-center shadow-lg">
        <h1 
          style={{ color: "white" }}
          className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
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
                  ref={(el) => (imgRefs.current[index] = el)}
                  src={item.source}
                  alt={item.name}
                  className="w-24 h-24 object-contain mb-4"
                />
                <div className="absolute bottom-3">
                  <button
                    onClick={() => handleRedeem(item.points, item.name, index)}
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

      {/* tiny chew animation */}
      <style>{`
        .lion-chew img { animation: chew 0.35s ease-in-out 1; }
        @keyframes chew {
          0%   { transform: scale(1) rotate(0deg); }
          35%  { transform: scale(1.08) rotate(6deg); }
          70%  { transform: scale(1.08) rotate(-6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
