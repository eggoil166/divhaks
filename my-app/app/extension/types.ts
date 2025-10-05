export interface ActivityLog {
  url: string;
  title: string;
  favIconUrl?: string;
  duration: number; // milliseconds
  timestamp: string;
}

export interface ReminderMessage {
  action: "showReminder";
  text?: string;
  imgUrl: string;
}

export interface CloseTabMessage {
  action: "closeTab";
  tabId: number;
}

export interface ActivityLog {
  url: string;
  title: string;
  favIconUrl?: string;
  duration: number; //ms
  timestamp: string;
}

export interface ReminderMessage {
  action: "showReminder";
  text?: string;
}

export interface CloseTabMessage {
  action: "closeTab";
  tabId: number;
}