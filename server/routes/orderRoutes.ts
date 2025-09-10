import express from "express";
import { isAuth } from "../middlewares/isAuthenticated";
import {
  createCheckoutSession,
  getOrders,
} from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.route("/get-order").get(isAuth, getOrders);
orderRouter
  .route("/checkout/create-checkout-session")
  .post(isAuth, createCheckoutSession);

export default orderRouter;
