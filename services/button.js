$(function() {
  function updateTimeAndDate() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const displayHours = String(hours).padStart(2, '0');

    document.getElementById('time').textContent = `${displayHours}:${minutes} ${ampm}`;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const dayName = days[now.getDay()];
    const dayNum = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
  
    document.getElementById('date').textContent = `${dayName}, ${dayNum} ${monthName} ${year}`;
    }

  updateTimeAndDate();
  setInterval(updateTimeAndDate, 1000);
});
