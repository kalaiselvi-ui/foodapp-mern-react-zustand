import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      id?: string; // optional at runtime until verified
    }
  }
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Try to get token from cookies
    let token = req.cookies?.token;

    // 2. If not in cookies, try Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "undefined") {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as
      | { userId?: string }
      | string;

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.id = decoded.userId;

    next();
  } catch (err: any) {
    console.error("Auth middleware error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
