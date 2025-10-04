import { ReminderMessage, CloseTabMessage } from "./types";

const reminderButton = document.getElementById("reminder")!;
const closeButton = document.getElementById("close")!;

reminderButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const message: ReminderMessage = {
    action: "showReminder",
    text: "Stay productive!",
  };
  chrome.tabs.sendMessage(tab.id!, message);
});

closeButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const message: CloseTabMessage = { action: "closeTab", tabId: tab.id! };
  chrome.runtime.sendMessage(message);
});
