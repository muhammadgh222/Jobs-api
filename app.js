const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const AppError = require("./utilities/AppError");
const ErrorHandler = require("./utilities/ErrorHandler");
// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();

app.set("trust proxy", 1); //For heruko
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(xss());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(ErrorHandler);

module.exports = app;
