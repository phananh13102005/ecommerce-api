import {
  getShipmentById,
  updateShipmentStatus
} from "../services/shipment.service.js";

const ALLOWED_STATUSES = [
  "PROCESSING",
  "SHIPPED",
  "DELIVERED"
];

export async function getShipment(req, res) {
  try {
    const shipid = Number(req.params.shipid);

    if (
      !Number.isInteger(shipid) ||
      shipid <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment id"
      });
    }

    const shipment =
      await getShipmentById(shipid);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    const isAdmin =
      req.user.role.rolename === "ADMIN";

    const isOwner =
      shipment.order.uid === req.user.uid;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to view this shipment"
      });
    }

    return res.status(200).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get shipment"
    });
  }
}

export async function changeShipmentStatus(
  req,
  res
) {
  try {
    const shipid = Number(req.params.shipid);

    if (
      !Number.isInteger(shipid) ||
      shipid <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment id"
      });
    }

    let { status } = req.body;

    if (
      !status ||
      typeof status !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "status is required"
      });
    }

    status = status.trim().toUpperCase();

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "status must be PROCESSING, SHIPPED or DELIVERED"
      });
    }

    const shipment =
      await updateShipmentStatus(
        shipid,
        status
      );

    return res.status(200).json({
      success: true,
      message:
        "Shipment status updated successfully",
      data: shipment
    });
  } catch (error) {
    console.error(error);

    if (error.message === "SHIPMENT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    if (
      error.message.startsWith(
        "INVALID_TRANSITION:"
      )
    ) {
      const [
        ,
        currentStatus,
        requestedStatus
      ] = error.message.split(":");

      return res.status(409).json({
        success: false,
        message:
          `Cannot change shipment from ${currentStatus} to ${requestedStatus}`
      });
    }

    if (
      error.message.startsWith(
        "FINAL_STATUS:"
      )
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Shipment has already reached its final status"
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Cannot update shipment status"
    });
  }
}