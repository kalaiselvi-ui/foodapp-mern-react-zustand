import express from "express";
import {
  createRestaurant,
  getRestaurant,
  getRestaurantOrder,
  getSingleRestaurant,
  searchRestaurant,
  updateOrderState,
  updateRestaurant,
} from "../controllers/restaurantController";
import { isAuth } from "../middlewares/isAuthenticated";
import { upload } from "../middlewares/multer";

const restaurantRouter = express.Router();

restaurantRouter
  .route("/create")
  .post(isAuth, upload.single("imageFile"), createRestaurant);
restaurantRouter.route("/").get(isAuth, getRestaurant);
restaurantRouter
  .route("/update")
  .put(isAuth, upload.single("imageFile"), updateRestaurant);
restaurantRouter.route("/order").get(isAuth, getRestaurantOrder);
restaurantRouter.route("/order/:orderId/status").put(isAuth, updateOrderState);
restaurantRouter.route("/:id").get(isAuth, getSingleRestaurant);
restaurantRouter.route("/search/:searchText").get(isAuth, searchRestaurant);

export default restaurantRouter;
