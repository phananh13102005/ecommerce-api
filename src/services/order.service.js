import prisma from "../config/prisma.js";

export async function createOrder(uid, items, shippingAddress) {
  return prisma.$transaction(async (tx) => {
    // 1. Lấy User + Membership hiện tại
    const user = await tx.user.findUnique({
      where: {
        uid
      },
      include: {
        membership: true
      }
    });

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    // 2. Lấy danh sách pid client gửi
    const productIds = items.map((item) => item.pid);

    // 3. Lấy Product thật từ database
    const products = await tx.product.findMany({
      where: {
        pid: {
          in: productIds
        }
      }
    });

    if (products.length !== productIds.length) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    let subtotal = 0;

    const orderDetails = [];

    // 4. Tính tiền từ giá thật trong database
    for (const item of items) {
      const product = products.find(
        (product) => product.pid === item.pid
      );

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `INSUFFICIENT_STOCK:${product.name}`
        );
      }

      const unitPrice = Number(product.price);

      subtotal += unitPrice * item.quantity;

      orderDetails.push({
        pid: product.pid,
        qty: item.quantity,
        unit_price: unitPrice
      });
    }


    // 6. Trừ stock một cách an toàn
    for (const item of items) {
      const result = await tx.product.updateMany({
        where: {
          pid: item.pid,
          quantity: {
            gte: item.quantity
          }
        },
        data: {
          quantity: {
            decrement: item.quantity
          }
        }
      });

      if (result.count !== 1) {
        const product = products.find(
          (product) => product.pid === item.pid
        );

        throw new Error(
          `INSUFFICIENT_STOCK:${product?.name ?? item.pid}`
        );
      }
    }

    // 7. Tạo Order
    const order = await tx.order.create({
      data: {
        uid,
      }
    });
    
    await tx.shipment.create({
    data: {
        oid: order.oid,
        status: "PENDING",
    }
    });

    // 8. Tạo OrderDetail
    await tx.orderDetail.createMany({
      data: orderDetails.map((detail) => ({
        oid: order.oid,
        pid: detail.pid,
        qty: detail.qty,
        unit_price: detail.unit_price
      }))
    });

    // 9. Trả lại Order đầy đủ
    return tx.order.findUnique({
      where: {
        oid: order.oid
      },
      include: {
        user: {
          select: {
            uid: true,
            fullname: true,
            username: true,

            membership: {
              select: {
                mid: true,
                mname: true,
                score: true
              }
            }
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
        },
        shipments: true
      }
    });
  });
}

export async function getOrdersByUser(uid) {
  return prisma.order.findMany({
    where: {
      uid
    },

    orderBy: {
      createdat: "desc"
    },

    include: {
      orderDetails: {
        include: {
          product: {
            select: {
              pid: true,
              name: true
            }
          }
        }
      },

      shipments: true
    }
  });
}

export async function getOrderById(oid) {
  return prisma.order.findUnique({
    where: {
      oid
    },

    include: {
      user: {
        select: {
          uid: true,
          fullname: true,
          username: true,

          membership: {
            select: {
              mid: true,
              mname: true,
              score: true
            }
          }
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
      },

      shipments: true
    }
  });
}