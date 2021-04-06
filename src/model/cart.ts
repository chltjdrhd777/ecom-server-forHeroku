import mongoose, { Document, Schema, Model } from "mongoose";

export interface EachCartItemType {
  _id: string;
  quantity: number;
  price: string;
  img: string;
  name: string;
}

export interface CartBaseDocumentType extends Document {
  user: string;
  cartItems: EachCartItemType[];
}

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
    cartItems: [
      {
        _id: { type: mongoose.SchemaTypes.ObjectId, ref: "Product", requried: true },
        quantity: { type: Number, default: 1 },
        price: { type: String, required: true },
        img: { type: String },
        name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<CartBaseDocumentType>("Cart", cartSchema);
