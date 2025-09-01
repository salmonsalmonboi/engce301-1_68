const apiKey = '2393c888f061866fad33d6e28a35add4';

// ----- DOM -----
const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
const skeleton = document.querySelector('#skeleton');
const favoritesContainer = document.querySelector('#favorites-container');
const refreshBtn = document.querySelector('#refresh-btn');

// ----- EVENTS -----
document.addEventListener('DOMContentLoaded', loadFavoriteCities);
refreshBtn?.addEventListener('click', loadFavoriteCities);

// form เดียว: ค้นหา + เพิ่ม favorite
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const cityName = cityInput.value.trim();
  if (!cityName) return alert('กรุณากรอกชื่อเมือง');
  await getWeather(cityName);        // แสดงผลด้านขวา
  cityInput.value = '';
});

// ลบเมืองด้วย delegation
favoritesContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('remove-btn')) return;
  const card = e.target.closest('.weather-card');
  const cityName = card?.dataset?.city;
  if (cityName) removeCityFromFavorites(cityName);
});

// ----- FAVORITES -----
function getFavoriteCities() {
  const raw = localStorage.getItem('favoriteCities');
  return raw ? JSON.parse(raw) : [];
}
function saveFavoriteCities(cities) {
  localStorage.setItem('favoriteCities', JSON.stringify(cities));
}
function loadFavoriteCities() {
  favoritesContainer.innerHTML = '';
  getFavoriteCities().forEach((c) => fetchAndDisplayWeather(c));
}

async function addCityToFavorites(inputName) {
  // ตรวจสอบชื่อเมืองกับ API เพื่อ normalize ชื่อ (เช่น Bangkok → กรุงเทพมหานคร)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(inputName)}&appid=${apiKey}&units=metric&lang=th`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`ไม่พบข้อมูลของ ${inputName}`);
    const data = await res.json();
    const apiName = data.name;

    const cities = getFavoriteCities();
    const exists = cities.some(c => c.toLowerCase() === apiName.toLowerCase());
    if (exists) return alert(`${apiName} อยู่ในรายการโปรดแล้ว`);

    cities.push(apiName);
    saveFavoriteCities(cities);
    // แสดงการ์ดเมืองที่เพิ่งเพิ่ม
    await fetchAndDisplayWeather(apiName);
  } catch (err) {
    console.error(err);
    alert(`เพิ่มรายการโปรดไม่สำเร็จ: ${err.message}`);
  }
}

function removeCityFromFavorites(cityName) {
  const newList = getFavoriteCities().filter(c => c.toLowerCase() !== cityName.toLowerCase());
  saveFavoriteCities(newList);
  // ลบการ์ดทันที
  const card = favoritesContainer.querySelector(`.weather-card[data-city="${cityName}"]`);
  if (card) card.remove();
}

// ----- FETCH & RENDER -----
async function fetchAndDisplayWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=th`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`ไม่พบข้อมูลของ ${city}`);
    const data = await response.json();

    const { name, main, weather } = data;
    const card = document.createElement('div');
    card.className = 'weather-card';
    card.dataset.city = name;
    card.innerHTML = `
      <div>
        <h3>${name}</h3>
        <p>${weather?.[0]?.description ?? '-'}</p>
      </div>
      <div class="text-right">
        <p class="temp">${main?.temp != null ? main.temp.toFixed(1) : '-'}°C</p>
      </div>
      <button class="remove-btn" aria-label="ลบ ${name}">X</button>
    `;
    favoritesContainer.appendChild(card);
  } catch (error) {
    console.error(error);
    const card = document.createElement('div');
    card.className = 'weather-card';
    card.innerHTML = `<h3>${city}</h3><p class="error">${error.message}</p>`;
    favoritesContainer.appendChild(card);
  }
}

// ----- THEME / LOADING / ONE-SHOT PANEL -----
function setTheme(conditionMain = "") {
  const body = document.body;
  body.className = "";
  const k = conditionMain.toLowerCase();
  if (k.includes('clear')) body.classList.add('clear');
  else if (k.includes('cloud')) body.classList.add('clouds');
  else if (k.includes('rain') || k.includes('drizzle')) body.classList.add('rain');
  else if (k.includes('thunder')) body.classList.add('thunderstorm');
  else if (k.includes('snow')) body.classList.add('snow');
  else if (k.includes('mist') || k.includes('fog') || k.includes('haze') || k.includes('smoke')) body.classList.add('mist');
  else body.classList.add('clouds');
}

function showLoading(isLoading){
  if (!skeleton) return;
  if (isLoading){
    skeleton.classList.remove('hidden');       // หรือ skeleton.style.display = 'block';
    weatherInfoContainer.innerHTML = '';
  } else {
    skeleton.classList.add('hidden');          // หรือ skeleton.style.display = 'none';
  }
}

async function getWeather(city) {
  showLoading(true);
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=th`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('ไม่พบเมืองที่ค้นหา');
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    weatherInfoContainer.innerHTML = `<p class="error">${err.message}</p>`;
  } finally {
    showLoading(false);
  }
}

// --- DISPLAY WEATHER (one-shot panel) ---
function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const { temp, humidity } = main;
  const { description, icon, main: conditionMain } = weather[0];
  const windKmh = (wind?.speed ?? 0) * 3.6;

  setTheme(conditionMain);

  weatherInfoContainer.innerHTML = `
    <div class="weather-current">
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
      <p class="temp">${temp.toFixed(1)}°C</p>
      <p>${description}</p>
      <p>ความชื้น: ${humidity}% · ลม: ${windKmh.toFixed(0)} กม./ชม.</p>
      <button id="fav-btn" data-city="${name}" class="fav-btn">❤️ เพิ่มเป็นเมืองโปรด</button>
    </div>
  `;

  // add listener ให้ปุ่มหัวใจ
  const favBtn = document.querySelector('#fav-btn');
  favBtn.addEventListener('click', () => {
    addCityToFavorites(name);
  });
}
// ----- INIT -----
(function init(){
  const last = localStorage.getItem('lastCity');
  if (last) getWeather(last);
})();
cityInput.addEventListener('change', () => {
  const val = cityInput.value.trim();
  if (val) localStorage.setItem('lastCity', val);
});
