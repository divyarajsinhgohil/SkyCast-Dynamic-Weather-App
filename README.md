# ⛅ SkyCast — Dynamic Weather App

> A premium, real-time weather dashboard with immersive, animated backgrounds that change based on the actual weather and local time of the searched city.

![SkyCast Preview](https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=1600)

---

## ✨ Features

- 🌍 **Real-Time Data** — Powered by [wttr.in](https://wttr.in), no API key required
- 🎨 **Dynamic Canvas Animations** — Fully animated backgrounds based on live weather:
  - ☀️ Sunny — Glowing rotating sun with rays
  - 🌡️ Heatwave (35°C+) — Intense blazing red/orange sun
  - 🌧️ Rain — 150 angled falling raindrops
  - ⛈️ Thunder — Rain + random lightning flash bursts
  - ❄️ Snow — 80 drifting glowing snowflakes with 3D depth
  - 🌬️ Blizzard — Wind streaks overlaid on snow
  - 🌤️ Partly Cloudy — Faint sun peeking through soft drifting clouds
  - 🌫️ Mist/Fog — Slow horizontal misty layers
  - 🌙 Night — Crescent moon + 120 twinkling stars (auto-detected by location time)
- 📅 **3-Day Forecast** — Min/Max temperatures for today and next 2 days
- 📍 **Location Details** — Humidity, Wind Speed, Feels Like, Visibility
- 💡 **Smart Night Detection** — Uses the local time of the searched city (not yours)
- 🔍 **Smart Search** — Handles unknown cities gracefully with clear error messages
- 📱 **Fully Responsive** — Works beautifully on mobile and desktop
- 🔌 **No API Key Needed** — Works out of the box

---

## 🚀 Getting Started

Just open `index.php` in any PHP server (like XAMPP/WAMP) or serve the static files:

```bash
# Clone the repo
git clone https://github.com/divyarajsinhgohil/skycast-weather.git

# Open in browser via XAMPP
http://localhost/skycast-weather/
```

---

## 🛠️ Tech Stack

| Tech | Usage |
|------|-------|
| **HTML5** | Structure & Template tags |
| **CSS3** | Glassmorphism UI, dynamic gradients |
| **Vanilla JavaScript** | Canvas 2D animation engine, API calls |
| **HTML5 Canvas** | All weather particle animations |
| **wttr.in API** | Free real-time weather data (JSON) |
| **Lucide Icons** | Weather & UI icons |
| **Google Fonts** | Inter typeface |

---

## 🌆 City Search Tips

- Large cities: `London`, `Dubai`, `New York`, `Tokyo`
- Indian cities: `Rajkot`, `Ahmedabad`, `Mumbai`, `Surat`
- Cold places: `Antarctica`, `Moscow`, `Reykjavik`
- Night test (IST): `New York`, `Los Angeles`, `Chicago`

---

## 📸 Scenes

| Condition | Background | Animation |
|-----------|------------|-----------|
| Clear/Sunny | Sky blue | Rotating sun |
| Hot (>35°C) | Red/Orange | Blazing sun |
| Cloudy | Grey | Drifting cloud blobs |
| Rain | Dark navy | Falling raindrops |
| Thunder | Dark purple | Rain + lightning |
| Snow (<0°C) | Dark blue | Snowflakes + wind |
| Mist/Fog | Slate grey | Drifting mist layers |
| Night | Deep indigo | Moon + twinkling stars |

---

## 👨‍💻 Developer

**Divyarajsinh Gohil**
- GitHub: [@divyarajsinhgohil](https://github.com/divyarajsinhgohil)
- LinkedIn: [divyarajsinh-gohil](https://www.linkedin.com/in/divyarajsinh-gohil-4a3b0237b/)
- Portfolio: [divyarajsinhgohil.lovestoblog.com](https://divyarajsinhgohil.lovestoblog.com)

---

## 📄 License

MIT License — feel free to use and modify!
