import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import userRouter from "./routes/userRoutes";
import restaurantRouter from "./routes/restaurantRoutes";
import menuRouter from "./routes/menuRoutes";
import orderRouter from "./routes/orderRoutes"; // if stripeWebhook is exported from orderRoutes
import bodyParser from "body-parser";
import cookieParser = require("cookie-parser");
import cors from "cors";
import path from "path";
import { stripeWebhook } from "./controllers/orderController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// --- Stripe Webhook must be before bodyParser.json() ---
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// --- Middleware ---
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://foodapp-client-react-zustand.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // for tools like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// --- API Routes ---
app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/menu", menuRouter);
app.use("/api/order", orderRouter);

// --- Connect to DB and start server ---
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
