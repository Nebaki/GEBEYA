const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");
const { newOrder, getSingleOrder, myOrders } = require("../controllers/orderController");
  
  router.route(`/order/new`).post(isAuthenticated, newOrder);
  router.route("/order/:id").get(getSingleOrder);
  router.route("/order/me").get(isAuthenticated,myOrders);
  


  module.exports = router;