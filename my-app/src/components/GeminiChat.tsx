import React, { useState, useRef, useEffect } from "react";
import { askGemini as askGeminiClient } from "../test-gemini";
import "./gemini-chat.css";

interface GeminiChatProps {
  dashboardData: {
    screenTimeMinutes: number;
    screenTimeGoal: number;
    pointsToday: number;
    tasksToday: number;
    tasksWeek: number;
  };
}

function fmtMin(m: number) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}h ${mm}m`;
}

export default function GeminiChat({ dashboardData }: GeminiChatProps) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Generate initial summary when component mounts
  useEffect(() => {
    if (!initialized) {
      const pct = Math.min(
        100,
        Math.round((dashboardData.screenTimeMinutes / dashboardData.screenTimeGoal) * 100)
      );
      
      const summary = `Hello! 👋

📊 **Daily Summary**

• Screen Time: ${fmtMin(dashboardData.screenTimeMinutes)} / ${fmtMin(dashboardData.screenTimeGoal)} (${pct}%)
• Points Today: ${dashboardData.pointsToday}
• Tasks Completed Today: ${dashboardData.tasksToday}
• Tasks This Week: ${dashboardData.tasksWeek}

${pct < 80 ? "Great job staying under your screen time goal! 🎉" : "You're approaching your screen time limit. Consider taking a break! 💪"}`;

      const followUp = "How else can I assist you today?";

      setMessages([
        { role: "ai", text: summary },
        { role: "ai", text: followUp }
      ]);
      setInitialized(true);
    }
  }, [initialized, dashboardData]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);
    try {
      const reply = await askGeminiClient(trimmed);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: `Error: ${e?.message || e}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="gc-wrap">
      <div className="gc-header">💬 Gemini Chat</div>
      <div className="gc-body">
        {messages.map((m, i) => (
          <div key={i} className={`gc-msg ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="gc-msg ai">Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div className="gc-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Type your message…"
        />
        <button onClick={send} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}