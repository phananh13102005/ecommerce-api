import {
  createOrder,
  getOrdersByUser,
  getOrderById
} from "../services/order.service.js";

export async function addOrder(req, res) {
  try {
    const { items} = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items must be a non-empty array"
      });
    }

    const normalizedItems = [];

    const productIds = new Set();

    for (const item of items) {
      const pid = Number(item.pid);
      const quantity = Number(item.quantity);

      if (!Number.isInteger(pid) || pid <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each pid must be a positive integer"
        });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each quantity must be a positive integer"
        });
      }

      if (productIds.has(pid)) {
        return res.status(400).json({
          success: false,
          message:
            `Product ${pid} appears more than once`
        });
      }

      productIds.add(pid);

      normalizedItems.push({
        pid,
        quantity
      });
    }

    const order = await createOrder(
      req.user.uid,
      normalizedItems
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order
    });
  } catch (error) {
    console.error(error);

    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "One or more products do not exist"
      });
    }

    if (
      error.message.startsWith(
        "INSUFFICIENT_STOCK:"
      )
    ) {
      const productName =
        error.message.split(":")[1];

      return res.status(409).json({
        success: false,
        message:
          `Insufficient stock for product: ${productName}`
      });
    }

    return res.status(500).json({
      success: false,
      message: "Cannot create order"
    });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await getOrdersByUser(
      req.user.uid
    );

    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get orders"
    });
  }
}

export async function getOrder(req, res) {
  try {
    const oid = Number(req.params.oid);

    if (!Number.isInteger(oid) || oid <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id"
      });
    }

    const order = await getOrderById(oid);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const isAdmin =
      req.user.role.rolename === "ADMIN";

    const isOwner =
      order.uid === req.user.uid;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to view this order"
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Cannot get order"
    });
  }
}