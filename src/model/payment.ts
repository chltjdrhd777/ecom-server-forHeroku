import mongoose, { Document, Schema, Model, SchemaDefinition, Types } from "mongoose";

export interface ProductType {
  price: string;
  quantity: number;
  _id: string;
}

export interface PayCheck_DocumentType extends Document {
  addressId: string;
  products: ProductType[];
  totalPrice: string;
  accountInfo: {
    cardNumber: number;
    bankName: string;
    cardPassword: number;
  };
}

const PayCheck_SchemaDefinition = {
  addressId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Address",
  },
  products: {
    type: Array,
    default: [],
  },
  totalPrice: {
    type: String,
  },
  accountInfo: {
    type: {
      cardNumber: Number,
      bankName: String,
      cardPassword: Number,
    },
  },
};

const paycheck = new mongoose.Schema<PayCheck_DocumentType, Model<PayCheck_DocumentType>>(PayCheck_SchemaDefinition, { timestamps: true });

//! ///////////////////////////////////////////////////////////////////////////
export interface Payment_DocumentType extends Document {
  userId: string;
  paymentDoc: Types.DocumentArray<PayCheck_DocumentType>;
}

const Payment_SchemaDefinition = {
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  paymentDoc: {
    type: [paycheck],
  },
};

//! Schema and model
const payment = new mongoose.Schema<Payment_DocumentType, Model<Payment_DocumentType>>(Payment_SchemaDefinition);

export default mongoose.model("Payment", payment);
