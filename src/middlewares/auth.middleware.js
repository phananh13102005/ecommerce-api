import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { findUserById } from "../services/auth.service.js";

export async function authenticate(req, res, next) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.jwtSecret
    );

    const user = await findUserById(decoded.uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
}