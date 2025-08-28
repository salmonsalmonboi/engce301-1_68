const apiKey = '2393c888f061866fad33d6e28a35add4'; // api key for OpenWeatherMap

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim(); //.trim() to remove whitespace
    if (cityName) {
        getWeather(cityName);
    } else {
        alert('Please enter a city name.');
    }
});

async function getWeather(city) {
    
    // Show loading message
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`; // 'Loading data...' in Thai

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`; // 'lang=th' for Thai language
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`; // Error message in Thai
    }
}

function displayWeather(data) {
    // Destructure necessary data from the API response
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const {description, icon } = weather[0];

    // use template literals to create the HTML content
    const weatherHTML = `
    <h2>${name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <p class="temp">${temp.toFixed(1)}°C</p>
    <p>${description}</p>
    <p>ความชื้น: ${humidity}%</p>
    `;
    
    weatherInfoContainer.innerHTML = weatherHTML;
}