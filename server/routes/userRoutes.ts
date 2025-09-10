import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  updateProfile,
  verifyEmail,
} from "../controllers/userController";
import { isAuth } from "../middlewares/isAuthenticated";

const userRouter = express.Router();

userRouter.route("/check-auth").get(isAuth, checkAuth);
userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(logout);
userRouter.route("/verify-email").post(verifyEmail);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password/:token").post(resetPassword);
userRouter.route("/profile/update").put(isAuth, updateProfile);

export default userRouter;
