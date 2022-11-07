const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utilities/AppError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const signup = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });

  createSendToken(user, 201, res);
});

const login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  createSendToken(user, 200, res);
});

const protect = AsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});
const getUser = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("There is no such user", 404));
  }
  res.status(201).json({
    status: "success",
    user,
  });
});
module.exports = { signup, login, protect, getUser };
