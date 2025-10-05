import React, { useState, DragEvent } from "react";

type ZoneId = "urgent" | "important" | "chill";

interface Task {
  id: number;
  title: string;
  emoji: string;
  zone: ZoneId;
}

interface Zone {
  id: ZoneId;
  name: string;
  bg: string;
  border: string;
}

const mockTasks: Task[] = [
  { id: 1, title: "Do math hw", emoji: "📐", zone: "urgent" },
  { id: 2, title: "Write email to john", emoji: "✉️", zone: "important" },
  { id: 3, title: "Study for quiz", emoji: "📚", zone: "urgent" },
  { id: 4, title: "Call dentist", emoji: "🦷", zone: "important" },
  { id: 5, title: "Meal prep", emoji: "🥗", zone: "chill" },
  { id: 6, title: "Gym session", emoji: "💪", zone: "chill" },
];

const encouragements = [
  "This looks balanced!",
  "Nice focus setup!",
  "Love the organization!",
  "You've got this!",
  "Great prioritization!",
  "Looking good!",
];

const zones: Zone[] = [
  { id: "urgent", name: "Urgent", bg: "bg-red-200/40", border: "border-red-400/50" },
  { id: "important", name: "Important", bg: "bg-orange-200/40", border: "border-orange-400/50" },
  { id: "chill", name: "Chill Tasks", bg: "bg-green-200/40", border: "border-green-400/50" },
];

export default function Schedule(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [encouragement, setEncouragement] = useState<string>("");
  const [showEncouragement, setShowEncouragement] = useState<boolean>(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, newZone: ZoneId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === draggedTask.id ? { ...task, zone: newZone } : task
    );
    setTasks(updatedTasks);

    // Show random encouragement
    const randomMsg = encouragements[Math.floor(Math.random() * encouragements.length)];
    setEncouragement(randomMsg);
    setShowEncouragement(true);
    setTimeout(() => setShowEncouragement(false), 2500);

    setDraggedTask(null);
  };

  const getTasksByZone = (zoneId: ZoneId) => tasks.filter((task) => task.zone === zoneId);

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--text)] pt-28 pb-10 px-6 lg:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        <div className="text-sm opacity-70">Drag tasks between zones</div>
      </div>

      {/* Encouragement notification */}
      <div
        className={`fixed top-24 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-50 ${
          showEncouragement
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] text-white px-6 py-3 rounded-full shadow-lg font-semibold">
          {encouragement}
        </div>
      </div>

      {/* Three-column task board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div
            key={zone.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, zone.id)}
            className="rounded-xl bg-gray-400/10 backdrop-blur border border-gray-300/30 p-6 min-h-[600px]"
          >
            <h3 className="text-xl font-bold mb-4 text-center">{zone.name}</h3>
            <div className="space-y-4">
              {getTasksByZone(zone.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className={`rounded-xl ${zone.bg} backdrop-blur border-2 ${zone.border} shadow-sm hover:shadow-lg transition-all cursor-move p-6 flex flex-col items-center justify-center text-center ${
                    draggedTask?.id === task.id ? "opacity-50 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <div className="text-4xl mb-2">{task.emoji}</div>
                  <div className="text-base font-semibold text-[var(--text)]">{task.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-sm opacity-60">
        <p>Drag tasks between zones to organize by priority</p>
      </div>
    </div>
  );
}
