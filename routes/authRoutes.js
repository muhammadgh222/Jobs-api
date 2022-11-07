const express = require("express");
const {
  signup,
  login,
  getUser,
  protect,
} = require("../controllers/authController");
const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/:id").get(protect, getUser);

module.exports = router;
