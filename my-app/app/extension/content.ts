import { ReminderMessage } from "./types";

chrome.runtime.onMessage.addListener((message: ReminderMessage) => {
  if (message.action === "showReminder") {
    const banner = document.createElement("div");
    banner.textContent = message.text || "⏰ Focus time!";
    Object.assign(banner.style, {
      position: "fixed",
      top: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(255, 200, 0, 0.95)",
      color: "#000",
      padding: "10px 20px",
      borderRadius: "10px",
      fontWeight: "bold",
      zIndex: "999999",
    });
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
  }
});
