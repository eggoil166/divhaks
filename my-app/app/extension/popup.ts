import { ReminderMessage, CloseTabMessage } from "./types";

const reminderButton = document.getElementById("reminder")!;
const closeButton = document.getElementById("close")!;

reminderButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Detect URL and choose image + message
  let imgUrl = "cat.png"; // default
  let text = "Lock in!";
  
  if (tab.url?.includes("chess.com")) {
    imgUrl = "angry.png";
    text = "Stop playing chess! Get back to work!";
  } else if (tab.url?.includes("notion.so") || tab.url?.includes("docs.google.com")) {
    imgUrl = "love.png"; // or use "cat.png" for happy
    text = "Great job staying productive! Keep it up!";
  }
  
  const message: ReminderMessage = {
    action: "showReminder",
    text: text,
    imgUrl: imgUrl
  };
  chrome.tabs.sendMessage(tab.id!, message);
});

closeButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const message: CloseTabMessage = { action: "closeTab", tabId: tab.id! };
  chrome.runtime.sendMessage(message);
});

// https://www.chess.com/
// https://www.notion.so/
// https://docs.google.com/spreadsheets/