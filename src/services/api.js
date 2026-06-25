import axios from "axios";

// ═══════════════════════════════════════════════════
// WEATHER — Open-Meteo (free, no key needed)
// ═══════════════════════════════════════════════════

export const fetchCurrentWeather = async (city) => {
  try {
    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      throw new Error("City not found");
    }
    const { latitude, longitude, name, country } = geoRes.data.results[0];
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure`
    );
    const current = weatherRes.data.current;
    return {
      name: `${name}, ${country || ""}`.trim().replace(/,\s*$/, ""),
      temp: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.surface_pressure),
      wind_speed: current.wind_speed_10m,
      weather_code: current.weather_code,
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code),
    };
  } catch (error) {
    console.error("Weather service failure:", error);
    throw error;
  }
};

// Geocode search suggestions
export const searchCities = async (query) => {
  try {
    if (!query || query.length < 2) return [];
    const res = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`
    );
    return (res.data.results || []).map((r) => ({
      name: r.name,
      country: r.country || "",
      admin: r.admin1 || "",
      display: `${r.name}${r.admin1 ? `, ${r.admin1}` : ""}${r.country ? `, ${r.country}` : ""}`,
    }));
  } catch {
    return [];
  }
};

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown";
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}

// ═══════════════════════════════════════════════════
// NEWS — RSS-based (free, no key needed)
// ═══════════════════════════════════════════════════

export const fetchTopHeadlines = async () => {
  try {
    const response = await axios.get(
      `https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`
    );
    if (response.data.items) {
      return response.data.items.map((item) => ({
        title: item.title,
        description: item.description?.replace(/<[^>]*>/g, "") || "",
        urlToImage: item.enclosure?.link || item.thumbnail || null,
        source: { name: item.author || "NYT" },
        url: item.link,
        publishedAt: item.pubDate,
      }));
    }
    return [];
  } catch (error) {
    console.error("News service failure:", error);
    throw error;
  }
};

// ═══════════════════════════════════════════════════
// MOVIES — TMDB API (free key, genre & language support)
// ═══════════════════════════════════════════════════

const TMDB_API_KEY = "2dca580c2a14b55200e784d157207b4d";
const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// Map our category names → TMDB genre IDs
const GENRE_ID_MAP = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Music: 10402,
  Sports: 0,       // no exact match — we'll use keyword search
  Thriller: 53,
  Fantasy: 14,
  Romance: 10749,
};

// Supported languages
export const MOVIE_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", flag: "🇮🇳" },
  { code: "ko", label: "Korean", flag: "🇰🇷" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
];

/**
 * Discover movies by genre and language via TMDB.
 * Uses a random page (1-5) so different users get varied results.
 */
export const discoverMoviesByGenre = async (category, languageCode = "en") => {
  try {
    const genreId = GENRE_ID_MAP[category];
    const randomPage = Math.floor(Math.random() * 5) + 1;

    // For "Sports" (no genre ID), use keyword search instead
    if (!genreId) {
      const res = await axios.get(`${TMDB_BASE}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: category,
          language: `${languageCode}-${languageCode.toUpperCase()}`,
          page: randomPage,
        },
      });
      return (res.data.results || []).slice(0, 10);
    }

    const res = await axios.get(`${TMDB_BASE}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_genres: genreId,
        with_original_language: languageCode,
        sort_by: "popularity.desc",
        page: randomPage,
        "vote_count.gte": 10,
      },
    });
    return (res.data.results || []).slice(0, 10);
  } catch (error) {
    console.error(`TMDB discover failure for ${category}:`, error);
    throw error;
  }
};

/**
 * Fetch detailed movie info from TMDB (including credits for cast).
 */
export const fetchTMDBMovieDetails = async (movieId) => {
  try {
    const res = await axios.get(`${TMDB_BASE}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: "credits",
      },
    });
    return res.data;
  } catch (error) {
    console.error("TMDB detail fetch error:", error);
    throw error;
  }
};
