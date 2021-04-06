import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

//typeDef
export interface UserBaseDocumentType extends Document {
  firstName: string;
  lastName: string;
  profileName: string;
  email: string;
  password: string;
  role: string;
  contactNumber: string;
  profilePicture: string;
  token: string;
  authentification(password: string): Promise<boolean>;
}

interface UserStatics extends Model<UserBaseDocumentType> {}

//Schema
const userSchema: Schema<UserBaseDocumentType, UserStatics> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    profileName: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    contactNumber: { type: String },
    profilePicture: { type: String },
    token: { type: String },
  },
  { timestamps: true }
);

//pre
userSchema.pre<UserBaseDocumentType>("save", function (this, next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, encryted) => {
      if (err) throw err;
      this.password = encryted;
      next();
    });
  } else {
    next();
  }
});

//methods
userSchema.methods = {
  authentification: function (password) {
    return bcrypt.compare(password, this.password);
  },
};

//export
export default mongoose.model<UserBaseDocumentType, UserStatics>("User", userSchema);
