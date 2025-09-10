import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menuSchema";
import { Restaurant } from "../models/restaurantSchema";
import mongoose from "mongoose";

export const addMenu = async (req: Request, res: Response) => {
  try {
    const { title, description, price } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }
    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    const menu = await Menu.create({
      title,
      description,
      price,
      imageFile: imageUrl,
    });
    const restaurant = await Restaurant.findOne({ user: req.id }).populate(
      "menus"
    );
    if (restaurant) {
      (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
      await restaurant.save();
    }
    res
      .status(201)
      .json({ success: true, message: "Menu Added Successfully ", menu });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const file = req.file;

    const menu = await Menu.findByIdAndUpdate(id);
    if (!menu) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }
    Object.assign(menu, {
      ...(title && { title }),
      ...(description && { description }),
      ...(price && { price }),
    });
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      menu.imageFile = imageUrl;
    }
    await menu.save();
    return res.status(200).json({
      success: true,
      message: "Menu updated successfully",
      menu,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
