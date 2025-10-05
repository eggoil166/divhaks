import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const demo = {
  screenTimeMinutes: 142,
  screenTimeGoal: 240,
  pointsToday: 37,
  tasksToday: 6,
  tasksWeek: 28,
};

function fmtMin(m: number) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm}m`;
}

export default function Dashboard() {
  const pct = useMemo(() => {
    const v = Math.min(100, Math.round((demo.screenTimeMinutes / demo.screenTimeGoal) * 100));
    return v;
  }, []);

  const circumference = 2 * Math.PI * 70;
  const dashOffset = useMemo(() => circumference * (1 - pct / 100), [pct, circumference]);

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text)] pt-28 pb-10 px-6 lg:px-10 relative">
      {/* floating lion animation */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <img
          src="/baby-lion.webp"
          alt="Lion assistant"
          className="w-20 h-20 object-contain absolute animate-lion float-shadow opacity-90"
          style={{ left: "2%", bottom: "6%" }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="text-sm opacity-70">Welcome back 👋</div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-5 xl:col-span-4">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Screen Time (Today)</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)]/30 text-[var(--primary)] font-medium">Goal {fmtMin(demo.screenTimeGoal)}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-[180px] h-[180px]">
                <svg viewBox="0 0 160 160" className="w-[180px] h-[180px] rotate-[90deg]">
                  <circle cx="80" cy="80" r="70" stroke="rgb(146 195 223 / 0.35)" strokeWidth="16" fill="none" />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="url(#grad)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={dashOffset}
                    fill="none"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="50%" stopColor="var(--secondary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center rotate-90deg">
                  <div className="text-center">
                    <div className="text-3xl font-extrabold">{pct}%</div>
                    <div className="text-xs opacity-70">{fmtMin(demo.screenTimeMinutes)}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3">
                <Stat label="Points (today)" value={demo.pointsToday} />
                <Stat label="Tasks (today)" value={demo.tasksToday} />
                <Stat label="Tasks (week)" value={demo.tasksWeek} />
              </div>
            </div>
          </Card>
        </section>

        <section className="col-span-12 lg:col-span-7 xl:col-span-8 grid grid-cols-12 gap-6">
          <Card className="col-span-12 md:col-span-6">
            <h3 className="text-lg font-semibold mb-2">Points / Day</h3>
            <MiniChart caption="Last 7 days (demo)" />
          </Card>

          <Card className="col-span-12 md:col-span-6">
            <h3 className="text-lg font-semibold mb-2">Tasks / Day</h3>
            <MiniChart caption="Last 7 days (demo)" stagger />
          </Card>

          <Card className="col-span-12">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Per-Task Focus (today)</h3>
              <Link to="/tasks" className="text-sm text-[var(--primary)] hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase opacity-60">
                    <th className="py-2 pr-4">Task</th>
                    <th className="py-2 pr-4">On-screen</th>
                    <th className="py-2 pr-4">Off-screen</th>
                    <th className="py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--secondary)]/30">
                  {[
                    { name: "Study – DS & Algos", on: 52, off: 8 },
                    { name: "RocketTech – Logistics", on: 38, off: 12 },
                    { name: "Email & Planning", on: 21, off: 9 },
                  ].map((t, i) => (
                    <tr key={i}>
                      <td className="py-3 pr-4 font-medium">{t.name}</td>
                      <td className="py-3 pr-4">{fmtMin(t.on)}</td>
                      <td className="py-3 pr-4 opacity-80">{fmtMin(t.off)}</td>
                      <td className="py-3">{fmtMin(t.on + t.off)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="col-span-12">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Summary (Gemini)</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--secondary)]/30 text-[var(--primary)]">coming soon</span>
            </div>
            <p className="mt-2 text-sm opacity-80">
              Your AI will generate a short daily brief here (focus score, wins, suggested next tasks).
            </p>
          </Card>
        </section>
      </div>

      <style>{`
        .float-shadow { filter: drop-shadow(0 6px 10px rgba(0,0,0,0.18)); }
        @keyframes lionPath {
          0%   { transform: translate(0,0) rotate(0deg); }
          20%  { transform: translate(60vw, -4vh) rotate(4deg); }
          40%  { transform: translate(35vw, 12vh) rotate(-6deg); }
          60%  { transform: translate(75vw, 6vh) rotate(5deg); }
          80%  { transform: translate(20vw, -6vh) rotate(-4deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
        .animate-lion { animation: lionPath 36s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-2xl bg-white/80 backdrop-blur border border-[var(--secondary)]/40 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl p-3 bg-white/70 border border-[var(--secondary)]/40">
      <div className="text-[11px] uppercase tracking-wide opacity-70 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function MiniChart({ caption, stagger }: { caption: string; stagger?: boolean }) {
  const data = stagger ? [4,7,6,9,8,11,10] : [6,9,7,8,10,9,12];
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-2 h-28 mt-2 mb-3">
        {data.map((v, i) => (
          <div key={i} className="flex-1 bg-[var(--secondary)]/30 rounded-md overflow-hidden">
            <div
              className="bg-gradient-to-t from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] h-full rounded-md"
              style={{ height: `${(v / max) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="text-xs opacity-60">{caption}</div>
    </div>
  );
}