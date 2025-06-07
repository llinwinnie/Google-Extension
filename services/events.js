let eventsData = [];

function renderEvents() {
  const list = document.getElementById('eventsList');
  list.innerHTML = '';

  eventsData.forEach((event, index) => {
    const li = document.createElement('li');
    li.className = 'event-item';

    const eventDate = new Date(event.date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let countdownText = '';
    if (diffDays > 0) {
      countdownText = `${diffDays} days to go`;
    } else if (diffDays === 0) {
      countdownText = 'Today!';
    } else {
      countdownText = `${Math.abs(diffDays)} days ago`;
    }

    li.innerHTML = `
      <div class="event-content">
        <span>${event.name}</span>
        <button class="delete-btn" onclick="deleteEvent(${index})">×</button>
      </div>
      <div class="event-countdown">${countdownText}</div>
    `;
    list.appendChild(li);
  });
}


function addEvent(text) {
  const dateMatch = text.match(/(.*?)\s+(on|-)\s*(\d{4}-\d{2}-\d{2})/i);

  if (dateMatch) {
    const eventName = dateMatch[1].trim();
    const eventDate = dateMatch[3];
    eventsData.push({ name: eventName, date: eventDate });
  } else {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateStr = nextWeek.toISOString().split('T')[0];
    eventsData.push({ name: text, date: dateStr });
  }

  renderEvents();
}


function deleteEvent(index) {
  eventsData.splice(index, 1);
  renderEvents();
}


document.getElementById('eventInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && this.value.trim()) {
    addEvent(this.value.trim());
    this.value = '';
  }
});


renderEvents();


setInterval(renderEvents, 3600000);


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
