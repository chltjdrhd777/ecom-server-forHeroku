import mongoose, { Document, Schema, Model, SchemaDefinition, Types } from "mongoose";

//!typeDef///

export interface Payment_DocumentType_forFront {}

export interface Payment_DocumentType extends Document, Payment_DocumentType_forFront {}

//!Schema definition
const Payment_SchemaDefinition = {
  user: {
    type: Array,
    default: [],
  },
  data: {
    type: Array,
    default: [],
  },
  product: {
    type: Array,
    default: [],
  },
};

//! Schema and model
const payment = new mongoose.Schema<Payment_DocumentType, Model<Payment_DocumentType>>(Payment_SchemaDefinition, {
  timestamps: true,
});

export default mongoose.model("Payment", payment);
