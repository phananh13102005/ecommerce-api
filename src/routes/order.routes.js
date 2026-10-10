import express from "express";

import {
  addOrder,
  getMyOrders,
  getOrder
} from "../controllers/order.controller.js";

import {
  authenticate
} from "../middlewares/auth.middleware.js";

import {
  authorize
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("CUSTOMER"),
  addOrder
);

router.get(
  "/my",
  authenticate,
  getMyOrders
);

router.get(
  "/:oid",
  authenticate,
  getOrder
);

export default router;