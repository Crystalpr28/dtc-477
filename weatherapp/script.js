/*
PROJECT STATEMENT:
This project is an interactive weather visualization app that uses the OpenWeather API
and JavaScript fetch() to retrieve real-time weather data based on user input. The app
displays key weather information and translates the data into a dynamic canvas animation
that visually represents conditions like clouds, rain, snow, and storms. The goal is to
combine data and design to create an engaging “weather mood” experience.

LOGIC STEPS:

1. Wait for the user to submit the search form.
2. Get the city name from the input field.
3. Check if the input is empty.
4. If empty, show an error message and stop.
5. Build the API request URL using the city name and API key.
6. Use fetch() to request weather data from OpenWeather.
7. Convert the response into JSON format.
8. Check if the response is valid (status OK).
9. If not valid, display an error message (city not found).
10. If valid, extract important data:
- city name
- weather condition
-temperature
-humidity
- wind speed
-cloud percentage
11. Display the weather data in the UI.
12. Store the main weather condition (Clear, Clouds, Rain, Snow, Thunderstorm).
13. Reset any previous animation.
14. Create arrays for animation elements:
-stars
-clouds
-raindrops
-snowflakes
15. Generate random positions, sizes, and speeds for each element.
16. Start the animation loop using requestAnimationFrame().
17. Clear the canvas before each frame.
18. Draw the background gradient.
19. Draw animated stars with changing opacity (twinkling effect).
20. Draw moving cloud layers across the screen.
21. If weather is Rain, draw falling glowing raindrops.
22. If weather is Snow, draw falling snow particles.
23. If weather is Thunderstorm, draw rain + lightning flashes.
24. Add fog layers to create depth in the scene.
25. Continuously update positions of all elements for motion.
26. Loop the animation smoothly using requestAnimationFrame().
27. Handle user errors such as invalid city or network issues.
28. Allow the user to search again and update the animation dynamically.

JS MENTOR CHAT URL:

   https://chatgpt.com/share/69d741d3-9c78-83e8-85bd-8c9a05dbcbb1
   */


// === ELEMENTS ===
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");

const cityName = document.getElementById("city-name");
const weatherDesc = document.getElementById("weather-desc");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const clouds = document.getElementById("clouds");

const canvas = document.getElementById("weather-canvas");
const ctx = canvas.getContext("2d");

const apiKey = "1861770127eb7f816fdc67c431aec655";

// === STATE ===
let animationId;
let currentWeather = "";

let stars = [];
let cloudPuffs = [];
let raindrops = [];
let snowflakes = [];
let lightningFlash = 0;

// === EVENT ===
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  getWeather(city);
});

// === FETCH ===
async function getWeather(city) {
  message.textContent = "Loading...";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    displayWeather(data);
    startAnimation(data);

    message.textContent = "";
  } catch (err) {
    message.textContent = "City not found";
  }
}

// === DISPLAY ===
function displayWeather(data) {
  cityName.textContent = data.name;
  weatherDesc.textContent = data.weather[0].description;
  temp.textContent = Math.round(data.main.temp) + "°";
  humidity.textContent = "Humidity: " + data.main.humidity + "%";
  wind.textContent = "Wind: " + data.wind.speed + " mph";
  clouds.textContent = "Clouds: " + data.clouds.all + "%";
}

// === ANIMATION START ===
function startAnimation(data) {
  cancelAnimationFrame(animationId);

  currentWeather = data.weather[0].main;

  setupScene(data);
  animate(data);
}

// === SETUP ===
function setupScene(data) {
  stars = [];
  cloudPuffs = [];
  raindrops = [];
  snowflakes = [];

  // ⭐ stars
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02
    });
  }

  // ☁️ clouds
  for (let i = 0; i < 8; i++) {
    cloudPuffs.push({
      x: Math.random() * canvas.width,
      y: 80 + Math.random() * 150,
      size: 30 + Math.random() * 40,
      speed: 0.2 + Math.random() * 0.4
    });
  }

  // 🌧️ rain
  for (let i = 0; i < 100; i++) {
    raindrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 2
    });
  }

  // ❄️ snow
  for (let i = 0; i < 80; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3,
      speed: Math.random() * 2
    });
  }
}

// === LOOP ===
function animate(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawStars();
  drawClouds();

  if (currentWeather === "Rain") drawRain();
  if (currentWeather === "Snow") drawSnow();
  if (currentWeather === "Thunderstorm") drawStorm();

  drawFog();

  animationId = requestAnimationFrame(() => animate(data));
}

// === BACKGROUND ===
function drawBackground() {
  const g = ctx.createRadialGradient(
    canvas.width/2,
    canvas.height/2,
    50,
    canvas.width/2,
    canvas.height/2,
    canvas.width
  );

  g.addColorStop(0, "#0f2027");
  g.addColorStop(1, "#020305");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// === STARS ===
function drawStars() {
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  });
}

// === CLOUDS ===
function drawClouds() {
  cloudPuffs.forEach(c => {
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 0.8, c.y - 10, c.size * 1.2, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 1.6, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();

    c.x += c.speed;

    if (c.x > canvas.width + 100) {
      c.x = -150;
    }
  });

  ctx.shadowBlur = 0;
}

// === RAIN ===
function drawRain() {
  raindrops.forEach(d => {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + 12);

    ctx.strokeStyle = "rgba(79,172,254,0.8)";
    ctx.shadowColor = "#4facfe";
    ctx.shadowBlur = 10;

    ctx.stroke();

    d.y += d.speed;

    if (d.y > canvas.height) d.y = 0;
  });

  ctx.shadowBlur = 0;
}

// === SNOW ===
function drawSnow() {
  snowflakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    f.y += f.speed;

    if (f.y > canvas.height) f.y = 0;
  });
}

// === STORM ===
function drawStorm() {
  drawRain();

  if (Math.random() < 0.02) {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;

    ctx.beginPath();
    ctx.moveTo(400, 50);
    ctx.lineTo(370, 150);
    ctx.lineTo(420, 150);
    ctx.lineTo(380, 250);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
}

// === FOG ===
function drawFog() {
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 150, canvas.width, 40);
  ctx.fillRect(0, 220, canvas.width, 30);
}