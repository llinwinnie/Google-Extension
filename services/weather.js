navigator.geolocation.getCurrentPosition((position, error) => {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;


    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&hourly=temperature_2m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`)
        .then(weather => weather.json())
        .then(result => {
            console.log(result);
            const ele = document.querySelector("#weather p")

            if (ele) {
                ele.textContent = result.current.temperature_2m + "°F";
            } else {
                console.error("Element not found");
            }
        })
})