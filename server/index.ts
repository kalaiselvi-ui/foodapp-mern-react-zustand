import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import userRouter from "./routes/userRoutes";
import bodyParser from "body-parser";
import cookieParser = require("cookie-parser");
import cors from "cors";
import restaurantRouter from "./routes/restaurantRoutes";
import menuRouter from "./routes/menuRoutes";
import orderRouter from "./routes/orderRoutes";
import { stripeWebhook } from "./controllers/orderController";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

const DIRNAME = path.resolve();

app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

//Allow multiple origins
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials to be sent
  })
);

//api
app.use("/api/user", userRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/menu", menuRouter);
app.use("/api/order", orderRouter);

app.use(express.static(path.join(DIRNAME, "/client/dist")));
app.use("*", (_, res) => {
  res.sendFile(path.resolve(DIRNAME, "client", "dist", "index.html"));
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Listen at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
