import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/userSchema";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user: IUserDocument) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
    expiresIn: "7d",
  });
  // res.cookie("token", token, {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });
  return token;
};
