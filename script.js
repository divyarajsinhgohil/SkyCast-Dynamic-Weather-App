const BASE_URL = "https://wttr.in/";

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherContent = document.getElementById('weatherContent');
const weatherTemplate = document.getElementById('weatherTemplate');

// Animation state
let animationFrame = null;

document.addEventListener('DOMContentLoaded', () => { lucide.createIcons(); });

// --- Event Listeners ---
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});
locationBtn.addEventListener('click', () => { fetchWeather(""); });

// --- Fetch ---
async function fetchWeather(city) {
    showLoading();
    try {
        // wttr.in works best with simple city names - avoid over-encoding
        const safeCity = city.trim().replace(/\s+/g, '+');
        const url = `${BASE_URL}${safeCity}?format=j1`;
        
        const response = await fetch(url);
        const text = await response.text();
        
        // wttr.in returns HTML for unknown locations instead of JSON
        if (text.trim().startsWith('<') || text.trim().startsWith('Unknown')) {
            showError(`"${city}" not found. Try a nearby bigger city or check spelling.`);
            return;
        }
        
        let data;
        try {
            data = JSON.parse(text);
        } catch(e) {
            showError(`Could not read data for "${city}". Try a different spelling.`);
            return;
        }
        
        // Validate the data structure
        if (!data.current_condition || !data.current_condition[0]) {
            showError(`No weather data available for "${city}".`);
            return;
        }
        
        updateUI(data, city);
        
    } catch (e) {
        showError("Network error. Please check your internet connection.");
    }
}

// --- Build UI ---
function updateUI(data, query) {
    weatherContent.innerHTML = '';
    const clone = weatherTemplate.content.cloneNode(true);
    const current = data.current_condition[0];
    const area = data.nearest_area[0];

    // Always prefer the official name from API for accuracy
    const areaName = area.areaName[0]?.value || '';
    const countryName = area.country[0]?.value || '';
    const officialName = areaName ? `${areaName}, ${countryName}` : query;
    clone.getElementById('cityName').textContent = officialName;
    clone.getElementById('dateTime').textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    clone.getElementById('tempValue').textContent = current.temp_C;
    clone.getElementById('weatherDesc').textContent = current.weatherDesc[0].value;
    clone.getElementById('humidityValue').textContent = `${current.humidity}%`;
    clone.getElementById('windValue').textContent = `${current.windspeedKmph} km/h`;
    clone.getElementById('feelsLikeValue').textContent = `${current.FeelsLikeC}°C`;
    clone.getElementById('visibilityValue').textContent = `${current.visibility} km`;

    const iconContainer = clone.getElementById('mainIcon');
    iconContainer.innerHTML = `<i data-lucide="${getWeatherIcon(current.weatherDesc[0].value, parseInt(current.temp_C))}"></i>`;

    weatherContent.appendChild(clone);
    updateForecast(data.weather);
    updateBackground(current.weatherDesc[0].value, data);
    lucide.createIcons();
}

// --- Forecast ---
function updateForecast(forecastData) {
    const container = document.getElementById('forecastContainer');
    container.innerHTML = '';
    container.classList.add('visible');
    forecastData.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'short' });
        const iconName = getWeatherIcon(day.hourly[4].weatherDesc[0].value, parseInt(day.avgtempC));
        const card = document.createElement('div');
        card.className = 'forecast-card animate-fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `<span class="day">${dayName}</span><i data-lucide="${iconName}"></i><div class="temp"><span class="max-temp">${day.maxtempC}°</span><span class="min-temp">${day.mintempC}°</span></div>`;
        container.appendChild(card);
    });
}

// --- Background Manager ---
function updateBackground(condition, data) {
    const current = data.current_condition[0];
    const cond = condition.toLowerCase();
    const temp = parseInt(current.temp_C);
    const windSpeed = parseInt(current.windspeedKmph);

    // Detect location's local time
    const localTimeStr = current.localObsDateTime || "";
    let isNight = false;
    const timeMatch = localTimeStr.match(/(\d+):(\d+)\s+(AM|PM)/);
    if (timeMatch) {
        let h = parseInt(timeMatch[1]);
        const ap = timeMatch[3];
        if (ap === 'PM' && h < 12) h += 12;
        if (ap === 'AM' && h === 12) h = 0;
        isNight = h < 6 || h >= 19;
    }

    // Determine scene type
    let scene = 'clear';
    if (temp < 0 || cond.includes('snow') || cond.includes('blizzard') || cond.includes('sleet') || cond.includes('ice')) scene = 'snow';
    else if (cond.includes('thunder') || cond.includes('storm')) scene = 'thunder';
    else if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) scene = 'rain';
    else if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) scene = 'mist';
    else if (cond.includes('overcast') || cond.includes('cloud')) scene = 'cloudy';
    else if (cond.includes('clear') || cond.includes('sunny')) scene = 'clear';

    if (isNight) scene = 'night-' + scene;

    // Apply background colors
    document.body.className = '';
    if (scene.includes('snow'))          document.body.classList.add('weather-snow');
    else if (scene.includes('thunder'))  document.body.classList.add('weather-thunder');
    else if (scene.includes('rain'))     document.body.classList.add('weather-rain');
    else if (scene.includes('mist'))     document.body.classList.add('weather-mist');
    else if (scene.includes('cloudy'))   document.body.classList.add('weather-clouds');
    else if (scene.includes('night'))    document.body.classList.add('weather-night');
    else {
        document.body.classList.add(temp > 35 ? 'weather-heatwave' : 'weather-clear');
    }

    // Launch canvas animation
    startCanvasAnimation(scene, temp, windSpeed);
}

// =====================================================
// CANVAS ANIMATION ENGINE
// =====================================================
function startCanvasAnimation(scene, temp, windSpeed) {
    const bg = document.getElementById('bgAnimation');
    bg.innerHTML = '';

    // Cancel old animation loop
    if (animationFrame) cancelAnimationFrame(animationFrame);

    const canvas = document.createElement('canvas');
    canvas.id = 'weatherCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    bg.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];

    window.onresize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

    const isNight = scene.startsWith('night-');
    const baseScene = scene.replace('night-', '');

    // Draw static background elements (sun/moon)
    if (isNight) {
        drawMoon(ctx, canvas);
        spawnStars(particles, canvas);
    } else if (baseScene === 'clear') {
        drawSun(ctx, canvas, temp);
    } else if (baseScene === 'cloudy' || baseScene === 'mist') {
        drawSun(ctx, canvas, temp, 0.4); // faint sun through clouds
    }

    // Spawn particles
    if (baseScene === 'snow') spawnSnow(particles, canvas, windSpeed);
    else if (baseScene === 'rain' || baseScene === 'thunder') spawnRain(particles, canvas);
    else if (baseScene === 'cloudy') spawnClouds(particles, canvas);
    else if (baseScene === 'mist') spawnMist(particles, canvas);

    // Add wind streaks for snow+wind
    if (baseScene === 'snow' && (windSpeed > 20 || temp < -10)) spawnWind(particles, canvas);

    // ---- Draw Sun (static, drawn once) ----
    function drawSun(ctx, canvas, temp, alpha = 1) {
        const x = canvas.width * 0.82;
        const y = canvas.height * 0.18;
        const r = temp > 35 ? 80 : 60;
        const color = temp > 35 ? '#ff4500' : '#ffd700';
        const glow = temp > 35 ? '#ff220088' : '#ffc20044';

        ctx.save();
        ctx.globalAlpha = alpha;

        // Outer glow
        const grad = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 3);
        grad.addColorStop(0, glow);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Sun body
        const sunGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
        sunGrad.addColorStop(0, '#fff');
        sunGrad.addColorStop(0.4, color);
        sunGrad.addColorStop(1, temp > 35 ? '#c00' : '#f80');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // ---- Draw Moon ----
    function drawMoon(ctx, canvas) {
        const x = canvas.width * 0.82;
        const y = canvas.height * 0.18;
        const r = 55;

        // Moon glow
        const glow = ctx.createRadialGradient(x, y, r, x, y, r * 4);
        glow.addColorStop(0, 'rgba(200,220,255,0.15)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill();

        // Moon crescent
        ctx.fillStyle = '#ddeeff';
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(180,210,255,0.6)';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = document.body.classList.contains('weather-night') ? '#0f0c29' : '#302b63';
        ctx.beginPath(); ctx.arc(x - 18, y - 8, r * 0.85, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
    }

    // ---- Particle spawners ----
    function spawnSnow(arr, canvas, wind) {
        const drift = Math.min(wind * 0.1, 2);
        for (let i = 0; i < 80; i++) {
            const sz = Math.random() * 6 + 1;
            arr.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: sz, speed: Math.random() * 1.5 + 0.5, drift: (Math.random() - 0.4) * drift, opacity: Math.random() * 0.7 + 0.3, type: 'snow', swing: Math.random() * Math.PI * 2 });
        }
    }
    function spawnWind(arr, canvas) {
        for (let i = 0; i < 15; i++) {
            arr.push({ x: -300, y: Math.random() * canvas.height, w: Math.random() * 200 + 100, h: Math.random() * 1.5 + 0.5, speed: Math.random() * 8 + 6, opacity: Math.random() * 0.3 + 0.1, type: 'wind' });
        }
    }
    function spawnRain(arr, canvas) {
        for (let i = 0; i < 150; i++) {
            arr.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, len: Math.random() * 20 + 10, speed: Math.random() * 8 + 10, opacity: Math.random() * 0.5 + 0.2, type: 'rain' });
        }
    }
    function spawnClouds(arr, canvas) {
        for (let i = 0; i < 8; i++) {
            arr.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5, r: Math.random() * 120 + 80, speed: Math.random() * 0.3 + 0.1, opacity: Math.random() * 0.25 + 0.1, type: 'cloud' });
        }
    }
    function spawnStars(arr, canvas) {
        for (let i = 0; i < 120; i++) {
            arr.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.7, r: Math.random() * 2 + 0.5, opacity: Math.random(), twinkle: Math.random() * 0.02 + 0.005, dir: 1, type: 'star' });
        }
    }
    function spawnMist(arr, canvas) {
        for (let i = 0; i < 10; i++) {
            arr.push({ x: -500, y: Math.random() * canvas.height, w: Math.random() * 400 + 200, h: Math.random() * 80 + 40, speed: Math.random() * 0.8 + 0.2, opacity: Math.random() * 0.12 + 0.05, type: 'mist' });
        }
    }

    // Sun rotation angle for rays
    let sunAngle = 0;

    // ---- Animate Loop ----
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Rotating sun rays (if clear day)
        if (!isNight && (baseScene === 'clear' || baseScene === 'cloudy' || baseScene === 'mist')) {
            const sx = canvas.width * 0.82, sy = canvas.height * 0.18;
            ctx.save();
            ctx.translate(sx, sy);
            ctx.rotate(sunAngle);
            ctx.globalAlpha = baseScene === 'clear' ? 0.12 : 0.05;
            ctx.strokeStyle = temp > 35 ? '#ff4500' : '#ffd700';
            ctx.lineWidth = 8;
            for (let r = 0; r < 12; r++) {
                const angle = (r / 12) * Math.PI * 2;
                const inner = temp > 35 ? 90 : 70;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
                ctx.lineTo(Math.cos(angle) * (inner + 80), Math.sin(angle) * (inner + 80));
                ctx.stroke();
            }
            ctx.restore();
            sunAngle += 0.003;
        }

        // Draw particles
        particles.forEach(p => {
            if (p.type === 'snow') {
                p.swing += 0.03;
                p.x += Math.sin(p.swing) * 0.5 + p.drift;
                p.y += p.speed;
                if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = 'white';
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(200,230,255,0.8)';
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            } else if (p.type === 'wind') {
                p.x += p.speed;
                if (p.x > canvas.width + 300) p.x = -p.w - 100;
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = 'rgba(255,255,255,0.7)';
                ctx.beginPath();
                ctx.ellipse(p.x + p.w / 2, p.y, p.w / 2, p.h, 0, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'rain') {
                p.x -= 2; p.y += p.speed;
                if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
                ctx.globalAlpha = p.opacity;
                ctx.strokeStyle = 'rgba(180,210,255,0.7)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - 4, p.y + p.len);
                ctx.stroke();
            } else if (p.type === 'cloud') {
                p.x += p.speed;
                if (p.x - p.r > canvas.width) p.x = -p.r;
                ctx.globalAlpha = p.opacity;
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                g.addColorStop(0, 'white');
                g.addColorStop(1, 'transparent');
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'star') {
                p.opacity += p.twinkle * p.dir;
                if (p.opacity > 1 || p.opacity < 0.1) p.dir *= -1;
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            } else if (p.type === 'mist') {
                p.x += p.speed;
                if (p.x > canvas.width + 500) p.x = -p.w;
                ctx.globalAlpha = p.opacity;
                const gm = ctx.createRadialGradient(p.x + p.w / 2, p.y, 0, p.x + p.w / 2, p.y, p.w / 2);
                gm.addColorStop(0, 'rgba(255,255,255,0.6)');
                gm.addColorStop(1, 'transparent');
                ctx.fillStyle = gm;
                ctx.beginPath(); ctx.ellipse(p.x + p.w / 2, p.y, p.w / 2, p.h / 2, 0, 0, Math.PI * 2); ctx.fill();
            }
        });

        ctx.globalAlpha = 1;
        animationFrame = requestAnimationFrame(animate);
    }

    animate();
}

// --- Icon Map ---
function getWeatherIcon(condition, temp) {
    const cond = condition.toLowerCase();
    if (temp < 0 || cond.includes('snow') || cond.includes('blizzard')) return 'cloud-snow';
    if (cond.includes('thunder')) return 'cloud-lightning';
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) return 'cloud-rain';
    if (cond.includes('cloud')) return 'cloud';
    if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) return 'cloud-fog';
    if (cond.includes('clear') || cond.includes('sunny')) return 'sun';
    return 'cloud';
}

function showLoading() {
    weatherContent.innerHTML = '<div class="welcome-msg"><h2>Connecting to Satellite...</h2></div>';
}

function showError(msg) {
    weatherContent.innerHTML = `<div class="welcome-msg"><h2 style="color:#ff4b4b">Oops!</h2><p>${msg}</p></div>`;
}
