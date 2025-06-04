navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Weather fetch failed");
        return response.json();
      })
      .then((data) => {
        const tempF = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;
        let iconUrl = "";
        if (code === 0) {
          iconUrl = "https://openweathermap.org/img/wn/01d@2x.png";
        } else if (code < 4) {
          iconUrl = "https://openweathermap.org/img/wn/03d@2x.png";
        } else {
          iconUrl = "https://openweathermap.org/img/wn/04d@2x.png";
        }
        $("#weather-icon").attr("src", iconUrl).show();
        $("#weather-text").text(`${tempF}°F`);
      })
      .catch((err) => {
        console.error("Error fetching weather:", err);
        $("#weather-text").text("Weather unavailable");
      });
  },
  (error) => {
    console.error("Geolocation failed:", error);
    $("#weather-text").text("Location unavailable");
  }
);
