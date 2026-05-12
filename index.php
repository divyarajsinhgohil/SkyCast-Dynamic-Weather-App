<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkyCast | Premium Dynamic Weather</title>
    <link rel="stylesheet" href="style.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="weather-clear"> <!-- Default class -->
    <div id="bgAnimation" class="bg-animation"></div>
    <div class="overlay"></div>
    
    <main class="app-container">
        <header class="search-section">
            <div class="search-box glass">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" id="cityInput" placeholder="Search city..." spellcheck="false">
                <button id="searchBtn" class="btn-icon">
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
            <button id="locationBtn" class="btn-location glass" title="Use my location">
                <i data-lucide="map-pin"></i>
            </button>
        </header>

        <section class="weather-display" id="weatherContent">
            <!-- Initial State / Loading -->
            <div class="welcome-msg">
                <h1 class="text-gradient">SkyCast</h1>
                <p>Enter a city to explore the weather</p>
            </div>
        </section>

        <section class="forecast-section" id="forecastContainer">
            <!-- Forecast items will be injected here -->
        </section>

        <footer class="app-footer">
            <p>&copy; 2026 SkyCast AI. Powered by Real-time Data.</p>
        </footer>
    </main>

    <!-- Templates (Hidden) -->
    <template id="weatherTemplate">
        <div class="weather-info animate-fade-in">
            <div class="main-card glass-card">
                <div class="location-time">
                    <h2 id="cityName">London, GB</h2>
                    <p id="dateTime">Tuesday, 12 May</p>
                </div>
                
                <div class="temp-section">
                    <div class="weather-icon-large" id="mainIcon">
                        <!-- Icon will be injected here -->
                    </div>
                    <div class="temp-container">
                        <span id="tempValue">24</span><span class="unit">°C</span>
                    </div>
                    <p id="weatherDesc" class="description">Cloudy Skies</p>
                </div>

                <div class="details-grid">
                    <div class="detail-item">
                        <i data-lucide="droplets" class="icon-blue"></i>
                        <div class="detail-text">
                            <span class="label">Humidity</span>
                            <span class="value" id="humidityValue">65%</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i data-lucide="wind" class="icon-teal"></i>
                        <div class="detail-text">
                            <span class="label">Wind Speed</span>
                            <span class="value" id="windValue">12 km/h</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i data-lucide="thermometer" class="icon-orange"></i>
                        <div class="detail-text">
                            <span class="label">Feels Like</span>
                            <span class="value" id="feelsLikeValue">26°C</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <i data-lucide="eye" class="icon-purple"></i>
                        <div class="detail-text">
                            <span class="label">Visibility</span>
                            <span class="value" id="visibilityValue">10 km</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <script src="script.js"></script>
</body>
</html>
