import { Request, Response } from "express";
import { Restaurant } from "../models/restaurantSchema";
import { IOrder, Order } from "../models/orderSchema";
import Stripe from "stripe";
import dotenv from "dotenv";
import { User } from "../models/userSchema";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CheckOutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.id })
      .populate("user")
      .populate("restaurant");
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckOutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    ).populate("menus");
    console.log(checkoutSessionRequest.restaurantId, "restaurantidcheck");

    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "restaurant not found" });
    }
    const order: any = new Order({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      status: "pending",
    });
    const menuItems = restaurant.menus;
    const lineItems = createLineItems(checkoutSessionRequest, menuItems);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA"],
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order/status`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: order._id.toString(),
        images: JSON.stringify(menuItems.map((item: any) => item.image)),
      },
    });
    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "error while creating session url" });
    }
    await order.save();
    return res.status(200).json({ session });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const stripeWebhook = async (req: Request, res: Response) => {
  let event;

  const sig = req.headers["stripe-signature"]!; // signature from Stripe

  try {
    // **use the raw body buffer directly**
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_ENDPOINT_SECRET!
    );

    console.log("Webhook received:", event.type);
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const order = await Order.findById(session.metadata?.orderId);
      if (!order) {
        console.log("Order not found:", session.metadata?.orderId);
        return res.status(404).send("Order not found");
      }

      order.status = "confirmed";
      if (session.amount_total) order.totalAmount = session.amount_total;
      await order.save();
      console.log("Order updated:", order._id);
      await User.findByIdAndUpdate(order.user, { $set: { cartItems: [] } });
    } catch (err) {
      console.error("Error updating order:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).send("Received");
};

export const createLineItems = (
  checkoutSessionRequest: CheckOutSessionRequest,
  menuItems: any
) => {
  //1.createline items
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item: any) => item._id.toString() === cartItem.menuId
    );
    if (!menuItem) throw new Error(`Menu item id not found `);
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: menuItem.title,
          images: [menuItem.imageFile],
        },
        unit_amount: menuItem.price * 100,
      },
      quantity: cartItem.quantity,
    };
  });
  return lineItems;
};
