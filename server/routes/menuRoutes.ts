import express from "express";
import { addMenu, editMenu } from "../controllers/menuController";
import { isAuth } from "../middlewares/isAuthenticated";
import { upload } from "../middlewares/multer";

const menuRouter = express.Router();

menuRouter.route("/add").post(isAuth, upload.single("imageFile"), addMenu);
menuRouter.route("/edit/:id").put(isAuth, upload.single("imageFile"), editMenu);

export default menuRouter;
