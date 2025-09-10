import { Request, Response } from "express";
import { Restaurant } from "../models/restaurantSchema";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/orderSchema";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;
    // console.log(restaurantName, city, country, deliveryTime, cuisines);
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already exist for the user",
      });
    }
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }
    const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
    await Restaurant.create({
      user: req.id,
      restaurantName,
      city,
      country,
      deliveryTime,
      cuisines: JSON.parse(cuisines),
      imageUrl,
    });
    res
      .status(201)
      .json({ success: true, message: "Restaurant Added ", restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id }).populate(
      "menus"
    );
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "No Restaurant Available",
        restaurant: [],
      });
    }
    return res.status(200).json({ success: true, restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
    const file = req.file;
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "No Restaurant Available" });
    }
    Object.assign(restaurant, {
      ...(restaurantName && { restaurantName }),
      ...(city && { city }),
      ...(country && { country }),
      ...(deliveryTime && { deliveryTime }),
      ...(cuisines && { cuisines: JSON.parse(cuisines) }),
    });
    if (file) {
      const imageUrl = await uploadImageOnCloudinary(
        file as Express.Multer.File
      );
      restaurant.imageUrl = imageUrl;
    }
    await restaurant.save();
    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRestaurantOrder = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.id });
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "No Restaurant Available" });
    }
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderState = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    order.status = status;
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order status updated",
      status: order.status,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = ((req.query.selectedCuisines as string) || "")
      .split(",")
      .filter(Boolean);

    const orConditions: any[] = [];

    if (searchQuery) {
      orConditions.push(
        { restaurantName: { $regex: searchQuery, $options: "i" } },
        { city: { $regex: searchQuery, $options: "i" } },
        { country: { $regex: searchQuery, $options: "i" } },
        { cuisines: { $regex: searchQuery, $options: "i" } }
      );
    }

    const query: any = {};
    if (orConditions.length > 0) {
      query.$or = orConditions;
    }
    if (selectedCuisines.length > 0) {
      query.cuisines = { $in: selectedCuisines }; // use $in for any match
    }

    const restaurants = await Restaurant.find(query);
    return res.status(200).json({ success: true, data: restaurants });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getSingleRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.id;
    console.log(req.params);
    console.log(restaurantId);
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "menus",
      options: { sort: { createdAt: -1 } },
    });
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "No Restaurant Available" });
    }
    return res.status(200).json({ success: true, restaurant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
