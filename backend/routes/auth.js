const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require(`../middleware/auth`);

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  GetAllUsers,
  getSinglUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const sendEmail = require("../utils/sendEmail");

router.route(`/register`).post(registerUser);
router.route(`/password/forgot`).post(forgotPassword);
router.route(`/password/reset/:token`).put(resetPassword);
router.route(`/login`).post(loginUser);
router.route(`/password/update`).put(isAuthenticated, updatePassword);
router.route("/logout").get(logoutUser);
router.route(`/me`).get(isAuthenticated, getUserProfile);

//Admin routes
router
  .route(`/admin/users`)
  .get(isAuthenticated, authorizeRole(`admin`), GetAllUsers);
router
  .route(`/admin/user/:id`)
  .get(isAuthenticated, authorizeRole(`admin`), getSinglUser)
  .put(isAuthenticated, authorizeRole(`admin`), updateUser)
  .delete(isAuthenticated, authorizeRole(`admin`), deleteUser);
module.exports = router;
