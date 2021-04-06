import mongoose, { Document, Schema, Model } from "mongoose";

export interface PageBaseDocumentType extends Document {
  title: string;
  description: string;
  banners: { img: string; href: string }[];
  products: { img: string; href: string }[];
  categoryId: any;
  createdBy: any;
  type: string;
  updatedAt: Date;
}

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    banners: [
      {
        img: String,
        href: String,
      },
    ],
    products: [
      {
        img: String,
        href: String,
      },
    ],
    categoryId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      unique: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<PageBaseDocumentType>("Page", pageSchema);
