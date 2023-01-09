const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleware/auth");

const {
  getAllProduct,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route(`/admin/product/new`).post(isAuthenticated, newProduct);
router
  .route(`/products`)
  .get(isAuthenticated, authorizeRole("admin"), getAllProduct);
router.route("/product/:id").get(getSingleProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticated, authorizeRole("admin"), updateProduct)
  .delete(isAuthenticated, authorizeRole("admin"), deleteProduct);

module.exports = router;
