const AsyncHandler = require("express-async-handler");
const Job = require("../models/jobModel");
const AppError = require("../utilities/AppError");

const createJob = AsyncHandler(async (req, res) => {
  req.body.addedBy = req.user._id;
  console.log(req.body.addedBy);
  const job = await Job.create(req.body);

  res.status(201).json({
    status: "success",
    job,
  });
});

const getAllJobs = AsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  const jobs = await Job.find({ addedBy: userId }).populate("addedBy");
  if (!jobs) {
    return next(new AppError("There is no such job", 404));
  }

  res.status(200).json({
    status: "success",
    jobs,
  });
});

const getJob = AsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.id;
  const job = await Job.findOne({ _id: id, addedBy: userId }).populate(
    "addedBy"
  );
  if (!job) {
    return next(new AppError("There is no such job", 404));
  }

  res.status(200).json({
    status: "success",
    job,
  });
});

const updateJob = AsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { title, company, status } = req.body;
  const id = req.params.id;
  const updatedjob = await Job.findByIdAndUpdate(
    { _id: id, addedBy: userId },
    { title, company, status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedjob) {
    return next(new AppError("There is no such job", 404));
  }

  if (!title && !company && !status) {
    return next(new AppError("Please provide fields to update"));
  }

  res.status(200).json({
    status: "success",
    updatedjob,
  });
});

const removeJob = AsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.id;
  const job = await Job.findByIdAndDelete({ _id: id, addedBy: userId });
  if (!job) {
    return next(new AppError("There is no such job", 404));
  }

  res.status(200).json({
    status: "success",
    job: null,
  });
});

module.exports = { createJob, getAllJobs, getJob, updateJob, removeJob };
