import prisma from "../config/prisma.js";

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: {
      pid: "asc"
    }
  });
}

export async function getProductById(pid) {
  return prisma.product.findUnique({
    where: {
      pid
    }
  });
}

export async function createProduct(data) {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      quantity: data.quantity
    }
  });
}

export async function updateProduct(pid, data) {
  return prisma.product.update({
    where: {
      pid
    },
    data: {
      name: data.pname,
      price: data.price,
      quantity: data.quantity
    }
  });
}

export async function deleteProduct(pid) {
  return prisma.product.delete({
    where: {
      pid
    }
  });
}