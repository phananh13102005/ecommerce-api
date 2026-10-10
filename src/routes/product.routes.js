import express from "express";

import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct
} from "../controllers/product.controller.js";

import {
  authenticate
} from "../middlewares/auth.middleware.js";

import {
  authorize
} from "../middlewares/role.middleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);

router.get("/:pid", getProduct);

// ADMIN only
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  addProduct
);

router.put(
  "/:pid",
  authenticate,
  authorize("ADMIN"),
  editProduct
);

router.delete(
  "/:pid",
  authenticate,
  authorize("ADMIN"),
  removeProduct
);

export default router;