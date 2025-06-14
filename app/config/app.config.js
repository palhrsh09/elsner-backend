module.exports = {
  API_URL: process.env.API_URL || "http://localhost:8000",
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "DEV",
  CORS_URLS: process.env.CORS_URLS || "http://localhost:5173"
};
