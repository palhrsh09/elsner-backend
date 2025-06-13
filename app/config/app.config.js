module.exports = {
  API_URL: process.env.API_URL || "http://localhost:8000",
  ADMIN_JWT_TOKEN: process.env.ADMIN_JWT_TOKEN || "your-secret-key",
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "DEV",
  ALTER_TABLE: process.env.ALTER_TABLE || "1",
  FORCE_TABLE: process.env.FORCE_TABLE || "0",
  CORS_URLS: process.env.CORS_URLS || "http://localhost:5173",
  JWT_ALLOWED_ROUTES: [
   {path: "/v1/list-users/byEmail", method: "POST" },
   {path: "/v1/list-users/:id", method: "GET" },
   {path: "/v1/list-users", method: "GET" },
   {path: "/v1/list-users/public/fetch"},
   {path: "/v1/list-forms/:id"},
  ],

  RBAC_ALLOWED_ROUTES: "/v1/list-users/byEmail,/v1/list-users/:id,/v1/list-users,/v1/list-users/byEmail,/v1/list-forms/:id,/v1/list-users/public/fetch",
};
