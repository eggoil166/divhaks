import { ReminderMessage } from "./types";

// Declare chrome as a global variable
declare const chrome: any;

chrome.runtime.onMessage.addListener((message: ReminderMessage) => {
  if (message.action === "showReminder") {
    showModal(message.text || "⏰ Focus time!", message.imgUrl);
  }
});

function showModal(text: string, imgUrl: string) {
  // Remove existing modal if any
  const existingModal = document.getElementById("productivity-modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.id = "productivity-modal-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "2147483647",
    animation: "fadeIn 0.3s ease-in-out",
  });

  // Create modal container
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
    animation: "slideIn 0.3s ease-out",
  });

  // Create image element
  const img = document.createElement("img");
  const imageUrl = chrome.runtime.getURL(imgUrl);
  img.src = imageUrl;
  Object.assign(img.style, {
    width: "200px",
    height: "200px",
    objectFit: "contain",
    marginBottom: "20px",
    borderRadius: "10px",
  });

  // Create text element
  const textEl = document.createElement("h2");
  textEl.textContent = text;
  Object.assign(textEl.style, {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  });

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Got it! 💪";
  Object.assign(closeBtn.style, {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.backgroundColor = "#5568d3";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.backgroundColor = "#667eea";
  });

  closeBtn.addEventListener("click", () => {
    overlay.remove();
  });

  // Add animations via style tag
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { 
        transform: translateY(-50px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Assemble modal
  modal.appendChild(img);
  modal.appendChild(textEl);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Auto-close after 10 seconds
  setTimeout(() => {
    if (overlay.parentElement) {
      overlay.remove();
    }
  }, 10000);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}
