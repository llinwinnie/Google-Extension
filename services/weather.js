$(document).ready(() => {
  console.log('Weather script loaded');
  
  // Get user's location and weather - this runs when the page loads
  getWeatherAndLocation();
});

function getWeatherAndLocation() {
  // Get the user's current position using browser geolocation
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      console.log('Got coordinates:', lat, lon);
      
      // Get weather data first - temperature and conditions
      getWeatherData(lat, lon);
      
      // Then get location data - convert coordinates to city name
      getLocationData(lat, lon);
    },
    (error) => {
      console.error("Geolocation failed:", error);
      $("#weatherText").text("Location unavailable");
    }
  );
}

function getWeatherData(lat, lon) {
  // Use cached weather data if available, otherwise fetch from API
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;
  
  apiCache.fetchWithCache(weatherUrl, {}, { maxAge: 5 * 60 * 1000 }) // Cache weather for 5 minutes
    .then((data) => {
      const tempF = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;
      
      // Use emoji icons instead of external images to avoid loading errors
      let weatherIcon = "";
      if (code === 0) {
        weatherIcon = "☀️"; // Clear sky
      } else if (code < 4) {
        weatherIcon = "⛅"; // Cloudy
      } else if (code < 50) {
        weatherIcon = "🌧️"; // Rain
      } else if (code < 70) {
        weatherIcon = "❄️"; // Snow
      } else {
        weatherIcon = "🌤️"; // Overcast
      }
      
      // Update the weather display with emoji instead of image
      $("#weatherIcon").hide(); // Hide the img element
      $("#weatherText").text(`${tempF}°F ${weatherIcon}`);
      
      // Store temperature for later use when location is loaded
      window.currentTemperature = tempF;
      
      // Update display with temperature
      updateWeatherDisplay();
    })
    .catch((err) => {
      console.error("Error fetching weather:", err);
      $("#weatherText").text("Weather unavailable");
    });
}

function getLocationData(lat, lon) {
  console.log('Getting location data for:', lat, lon);
  
  // Try multiple geocoding services - use the fastest one that works
  Promise.race([
    getLocationFromOpenMeteo(lat, lon),
    getLocationFromNominatim(lat, lon),
    getLocationFromGoogleGeocoding(lat, lon),
    getLocationFromSimpleFallback(lat, lon)
  ]).then((locationName) => {
    if (locationName) {
      console.log('Location found:', locationName);
      window.currentLocation = locationName;
      updateWeatherDisplay();
    } else {
      console.log('No location found, using coordinates');
      window.currentLocation = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
      updateWeatherDisplay();
    }
  }).catch((err) => {
    console.error('All geocoding services failed:', err);
    // Use simple fallback instead of coordinates
    window.currentLocation = getLocationFromSimpleFallback(lat, lon);
    updateWeatherDisplay();
  });
}

function getLocationFromOpenMeteo(lat, lon) {
  return new Promise((resolve, reject) => {
    // Use cached geocoding data if available, otherwise fetch from API
    const geocodingUrl = `https://api.open-meteo.com/v1/geocoding?latitude=${lat}&longitude=${lon}`;
    
    apiCache.fetchWithCache(geocodingUrl, {}, { maxAge: 30 * 60 * 1000 }) // Cache geocoding for 30 minutes
      .then((data) => {
        console.log('OpenMeteo response:', data);
        if (data.results && data.results.length > 0) {
          const location = data.results[0];
          let locationName = "";
          
          // Build location name from available data - city, state format
          if (location.name && location.admin1) {
            locationName = `${location.name}, ${location.admin1}`;
          } else if (location.name) {
            locationName = location.name;
          } else if (location.admin1) {
            locationName = location.admin1;
          } else if (location.country) {
            locationName = location.country;
          }
          
          if (locationName) {
            resolve(locationName);
          } else {
            reject(new Error("No location name found"));
          }
        } else {
          reject(new Error("No results from OpenMeteo"));
        }
      })
      .catch((err) => {
        console.error("OpenMeteo geocoding error:", err);
        reject(err);
      });
  });
}

function getLocationFromNominatim(lat, lon) {
  return new Promise((resolve, reject) => {
    // Use cached geocoding data if available, otherwise fetch from API
    const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    
    apiCache.fetchWithCache(geocodingUrl, {}, { maxAge: 30 * 60 * 1000 }) // Cache geocoding for 30 minutes
      .then((data) => {
      .then((data) => {
        console.log('Nominatim response:', data);
        if (data.address) {
          let locationName = "";
          
          // Try to get city and state from address data
          if (data.address.city && data.address.state) {
            locationName = `${data.address.city}, ${data.address.state}`;
          } else if (data.address.town && data.address.state) {
            locationName = `${data.address.town}, ${data.address.state}`;
          } else if (data.address.city) {
            locationName = data.address.city;
          } else if (data.address.town) {
            locationName = data.address.town;
          } else if (data.address.state) {
            locationName = data.address.state;
          } else if (data.address.country) {
            locationName = data.address.country;
          }
          
          if (locationName) {
            resolve(locationName);
          } else {
            reject(new Error("No location name found"));
          }
        } else {
          reject(new Error("No address data"));
        }
      })
      .catch((err) => {
        console.error("Nominatim geocoding error:", err);
        reject(err);
      });
  });
}

function getLocationFromGoogleGeocoding(lat, lon) {
  return new Promise((resolve, reject) => {
    // Use cached geocoding data if available, otherwise fetch from API
    const geocodingUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    
    apiCache.fetchWithCache(geocodingUrl, {}, { maxAge: 30 * 60 * 1000 }) // Cache geocoding for 30 minutes
      .then((data) => {
      .then((data) => {
        console.log('BigDataCloud response:', data);
        if (data.city && data.principalSubdivision) {
          const locationName = `${data.city}, ${data.principalSubdivision}`;
          resolve(locationName);
        } else if (data.city) {
          resolve(data.city);
        } else if (data.principalSubdivision) {
          resolve(data.principalSubdivision);
        } else if (data.countryName) {
          resolve(data.countryName);
        } else {
          reject(new Error("No location data found"));
        }
      })
      .catch((err) => {
        console.error("BigDataCloud geocoding error:", err);
        reject(err);
      });
  });
}

function getLocationFromSimpleFallback(lat, lon) {
  return new Promise((resolve, reject) => {
    // Manual coordinate mapping for common cities - fallback if APIs fail
    let locationName = "";
    
    // US East Coast cities
    if (lat >= 40.0 && lat <= 42.0 && lon >= -75.0 && lon <= -73.0) {
      locationName = "New York, NY";
    } else if (lat >= 40.0 && lat <= 42.0 && lon >= -77.0 && lon <= -75.0) {
      locationName = "Philadelphia, PA";
    } else if (lat >= 38.0 && lat <= 40.0 && lon >= -77.0 && lon <= -75.0) {
      locationName = "Washington, DC";
    } else if (lat >= 42.0 && lat <= 44.0 && lon >= -77.0 && lon <= -75.0) {
      locationName = "Ithaca, NY";
    } else if (lat >= 42.0 && lat <= 44.0 && lon >= -79.0 && lon <= -77.0) {
      locationName = "Buffalo, NY";
    } else if (lat >= 40.0 && lat <= 42.0 && lon >= -79.0 && lon <= -77.0) {
      locationName = "Pittsburgh, PA";
    }
    // US West Coast cities
    else if (lat >= 37.0 && lat <= 38.0 && lon >= -123.0 && lon <= -122.0) {
      locationName = "San Francisco, CA";
    } else if (lat >= 34.0 && lat <= 35.0 && lon >= -119.0 && lon <= -118.0) {
      locationName = "Los Angeles, CA";
    } else if (lat >= 47.0 && lat <= 48.0 && lon >= -123.0 && lon <= -122.0) {
      locationName = "Seattle, WA";
    }
    // US Central cities
    else if (lat >= 41.0 && lat <= 42.0 && lon >= -88.0 && lon <= -87.0) {
      locationName = "Chicago, IL";
    } else if (lat >= 29.0 && lat <= 30.0 && lon >= -96.0 && lon <= -95.0) {
      locationName = "Houston, TX";
    }
    // If no match found, use readable coordinates
    else {
      const latStr = lat > 0 ? `${lat.toFixed(2)}°N` : `${Math.abs(lat).toFixed(2)}°S`;
      const lonStr = lon > 0 ? `${lon.toFixed(2)}°E` : `${Math.abs(lon).toFixed(2)}°W`;
      locationName = `${latStr}, ${lonStr}`;
    }
    
    console.log('Using fallback location:', locationName);
    resolve(locationName);
  });
}

function updateWeatherDisplay() {
  // Combine temperature and location for final display
  const temp = window.currentTemperature;
  const location = window.currentLocation;
  
  if (temp && location) {
    // Get the current weather icon from the text
    const currentText = $("#weatherText").text();
    const weatherIcon = currentText.match(/[☀️⛅🌧️❄️🌤️]/)?.[0] || "";
    
    $("#weatherText").text(`${temp}°F ${weatherIcon} • ${location}`);
  } else if (temp) {
    // Keep the existing weather icon if we have temperature but no location
    const currentText = $("#weatherText").text();
    const weatherIcon = currentText.match(/[☀️⛅🌧️❄️🌤️]/)?.[0] || "";
    $("#weatherText").text(`${temp}°F ${weatherIcon}`);
  } else if (location) {
    $("#weatherText").text(location);
  }
}

console.log('Weather events bound successfully');
