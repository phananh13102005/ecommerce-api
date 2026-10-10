import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";
import env from "../config/env.js";

export async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: {
      username
    },
    include: {
      role: true,
      membership: true
    }
  });
}

export async function findUserById(uid) {
  return prisma.user.findUnique({
    where: {
      uid
    },
    include: {
      role: true,
      membership: true
    }
  });
}

export async function registerUser({
  username,
  fullname,
  password
}) {
  const customerRole = await prisma.role.findFirst({
    where: {
      rolename: "CUSTOMER"
    }
  });

  const normalMembership = await prisma.membership.findFirst({
    where: {
      mname: "NORMAL"
    }
  });

  if (!customerRole) {
    throw new Error("CUSTOMER_ROLE_NOT_FOUND");
  }

  if (!normalMembership) {
    throw new Error("NORMAL_MEMBERSHIP_NOT_FOUND");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      username,
      fullname,
      password: hashedPassword,
      roleid: customerRole.roleid,
      mid: normalMembership.mid
    },
    include: {
      role: true,
      membership: true
    }
  });
}

export async function comparePassword(
  plainPassword,
  hashedPassword
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(user) {
  return jwt.sign(
    {
      uid: user.uid
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn
    }
  );
}