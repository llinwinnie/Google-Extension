
chrome.alarms.create("dailyReminder", {
  when: Date.now() + 1000,           
  periodInMinutes: 24 * 60          // repeat every 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReminder") {
    // You could send a notification, or update some state in storage, etc.
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "DailyDo Reminder",
      message: "Don't forget to check your to-do list!"
    });
  }
});
