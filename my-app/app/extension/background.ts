let activeTab: chrome.tabs.Tab | null = null;
let activeStartTime: number | null = null;

chrome.tabs.onActivated.addListener(async (info) => {
  const tab = await chrome.tabs.get(info.tabId);
  handleTabChange(tab);
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {
    chrome.tabs.get(details.tabId, (tab) => handleTabChange(tab));
  }
});

function handleTabChange(tab: chrome.tabs.Tab) {
  const now = Date.now();
  if (activeTab && activeStartTime) {
    const duration = now - activeStartTime;
    sendActivityData(activeTab, duration);
  }
  activeTab = tab;
  activeStartTime = now;
}

function sendActivityData(tab: chrome.tabs.Tab, duration: number) {
  const log = {
    url: tab.url,
    title: tab.title,
    favIconUrl: tab.favIconUrl,
    duration,
    timestamp: new Date().toISOString()
  };
  console.log("Activity Log:", log);
  /*
  fetch("http://localhost:5000/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log)
  }).catch(console.error);
  */
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "closeTab" && msg.tabId) {
    chrome.tabs.remove(msg.tabId);
  }
});
