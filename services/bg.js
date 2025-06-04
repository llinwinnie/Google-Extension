chrome.alarms.create("dailyReminder", {
  when: Date.now() + 1000,
  periodInMinutes: 24 * 60
});


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReminder") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "DailyDo Reminder",
      message: "Don't forget to check your to-do list!",
    });
  }
});
