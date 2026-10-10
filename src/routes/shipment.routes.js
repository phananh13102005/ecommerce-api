import express from "express";

import {
  getShipment,
  changeShipmentStatus
} from "../controllers/shipment.controller.js";

import {
  authenticate
} from "../middlewares/auth.middleware.js";

import {
  authorize
} from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/:shipid",
  authenticate,
  getShipment
);

router.patch(
  "/:shipid/status",
  authenticate,
  authorize("ADMIN"),
  changeShipmentStatus
);

export default router;