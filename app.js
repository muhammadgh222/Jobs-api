const express = require("express");
const AppError = require("./utilities/AppError");
const ErrorHandler = require("./utilities/ErrorHandler");
// Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/auth", authRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(ErrorHandler);

module.exports = app;
