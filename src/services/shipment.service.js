import prisma from "../config/prisma.js";

const STATUS_TRANSITIONS = {
  PENDING: "PROCESSING",
  PROCESSING: "SHIPPED",
  SHIPPED: "DELIVERED"
};

export async function getShipmentById(shipid) {
  return prisma.shipment.findUnique({
    where: {
      shipid
    },

    include: {
      order: {
        include: {
          user: {
            select: {
              uid: true,
              fullname: true,
              username: true
            }
          },

          orderDetails: {
            include: {
              product: {
                select: {
                  pid: true,
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });
}

export async function updateShipmentStatus(
  shipid,
  newStatus
) {
  return prisma.$transaction(async (tx) => {
    const shipment = await tx.shipment.findUnique({
      where: {
        shipid
      },

      include: {
        order: true
      }
    });

    if (!shipment) {
      throw new Error("SHIPMENT_NOT_FOUND");
    }

    const currentStatus = shipment.status;

    const expectedNextStatus =
      STATUS_TRANSITIONS[currentStatus];

    if (!expectedNextStatus) {
      throw new Error(
        `FINAL_STATUS:${currentStatus}`
      );
    }

    if (newStatus !== expectedNextStatus) {
      throw new Error(
        `INVALID_TRANSITION:${currentStatus}:${newStatus}`
      );
    }

    const shipmentData = {
      status: newStatus
    };

    const updatedShipment =
      await tx.shipment.update({
        where: {
          shipid
        },

        data: shipmentData
      });

    await tx.order.update({
      where: {
        oid: shipment.oid
      },

      data: {
        status: newStatus
      }
    });

    return updatedShipment;
  });
}