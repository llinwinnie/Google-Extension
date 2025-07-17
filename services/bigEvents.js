$(document).ready(() => {
  chrome.storage.local.get(["bigEvents"], (data) => {
    const events = data.bigEvents || [];
    events.forEach((ev) => appendEvent(ev));
  });

  $("#eventInput").on("keypress", (e) => {
    if (e.which === 13) {
      const text = $("#eventInput").val().trim();
      if (!text) return;
      addEvent(text);
      $("#eventInput").val("");
    }
  });
});

function appendEvent(text) {
  const li = $(
    `<li><span class="event-text">${text}</span><button class="delete-event">×</button></li>`
  );
  $("#eventsList").append(li);
  li.find(".delete-event").on("click", function () {
    const evText = li.find(".event-text").text();
    removeEvent(evText);
    li.remove();
  });
}

function addEvent(text) {
  chrome.storage.local.get(["bigEvents"], (data) => {
    const events = data.bigEvents || [];
    events.push(text);
    chrome.storage.local.set({ bigEvents: events }, () => {
      appendEvent(text);
    });
  });
}

function removeEvent(text) {
  chrome.storage.local.get(["bigEvents"], (data) => {
    let events = data.bigEvents || [];
    events = events.filter((ev) => ev !== text);
    chrome.storage.local.set({ bigEvents: events });
  });
}
