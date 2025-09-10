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
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as
      | { userId?: string }
      | string;

    // Check runtime type & existence
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Attach the userId to the request object
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
