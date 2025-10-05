import React from "react";

export default function HomeBottom() {
  return (
    <div className="relative isolate overflow-hidden w-full min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="flex flex-col lg:flex-row w-full h-full px-6 pt-10 pb-24 lg:py-40">
        {/* Left Content */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 lg:px-0">
          <h1 className="mt-10 text-5xl font-semibold tracking-tight sm:text-7xl">
            Be Productive With{" "}
            <span className="relative inline-block">
              <span
                className="absolute inset-0 px-10 rounded-lg -rotate-1 transform"
                style={{
                  background: "linear-gradient(to right, var(--primary), var(--secondary), var(--accent))",
                }}
              ></span>
              <span
                className="absolute inset-0 px-10 rounded-lg rotate-1 transform"
                style={{
                  background: "linear-gradient(to left, var(--accent), var(--secondary), var(--primary))",
                }}
              ></span>
              <span className="relative z-10 font-bold text-white">
                Priorikitty
              </span>
            </span>
          </h1>

          <p className="flex-wrap mt-8 text-xl font-medium text-[var(--secondary)]">
            Be focused. Be rewarded. Prioritize playfully with <span className="font-bold text-[var(--accent)]">Priorikitty!</span>
          </p>

          <div className="mt-10 flex items-center gap-x-6 gap-y-4">
            <p
              className="text-white px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              style={{
                background:
                  "linear-gradient(to right, var(--primary), var(--secondary), var(--accent))",
              }}
            >
              Click a button above to get started!
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center items-center w-full lg:w-1/2 mt-16 lg:mt-0">
          <svg
            role="img"
            viewBox="0 0 366 729"
            className="w-[20rem] max-w-full drop-shadow-xl"
          >
            {/* SVG content unchanged */}
          </svg>
        </div>
        <div className="self-end">
          <img src="/baby-lion.webp" className="object-contain -translate-y-10"/>
        </div>
      </div>
    </div>
  );
}
