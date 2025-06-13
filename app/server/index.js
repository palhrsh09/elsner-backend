const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("../routes");
const config = require("../config/app.config");
require("dotenv").config();
const dbConfig = require("../config/db.config");

const app = express();

app.set("trust proxy", true);

const whitelist = config.CORS_URLS.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) > -1 || process.env.NODE_ENV === "DEV") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

require("../routes")(app, express);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

mongoose
  .connect(dbConfig.URI, {
    dbName: dbConfig.DB_NAME,
  })
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = app;
