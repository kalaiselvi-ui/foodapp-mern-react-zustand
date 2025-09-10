import mongoose from "mongoose";

export interface IMenu {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  imageFile: string;
}

export interface IMenuDocument extends IMenu, Document {
  createdAt: Date;
  updatedAt: Date;
}
const menuSchema = new mongoose.Schema<IMenuDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageFile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Menu = mongoose.model("Menu", menuSchema);
