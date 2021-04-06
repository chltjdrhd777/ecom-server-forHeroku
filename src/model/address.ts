import mongoose, { Document, Schema, Model, SchemaDefinition, Types } from "mongoose";

//# for practical use of types
//* keyof => you can use the kyes in interface or type by union form/ etc) inteface A {key1:string, key2:string} than, you can use the kye as the value ("kye1" | "key2");
//* enum => it is almose like using object as union style/ etc) enum Obj = {key1:"hey", key2:"how are you"}, const result : Obj = Obj.key1 <====== the value of const result could be "hey" | "how are you"
//! but, enum's complie result is like enum A { a,b,c} => after compile , {a:0,b:0,c:0,   '0':"a","1":"b","2":"c"};
//! so it is realy clumsy
//! Rather, use const enum/ const enum {a=value,b=value,c=value}

//* as const => if you want to define the object's or array's type strcitly, and make every properties as readonly, it is useful

//# 1. address data schema///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface Address_DocumentType extends Document {
  name: string;
  mobileNumber: string;
  pinCode: string;
  locality: string;
  address: string;
  cityDistrictTown: string;
  state: string;
  landmark: string;
  alternatePhone: string;
  addressType: string;
  timeSort: number;
  recentelyUsed: boolean;
}

export interface Address_DocumentType_forFront {
  name: string;
  mobileNumber: string;
  pinCode: string;
  locality: string;
  address: string;
  cityDistrictTown: string;
  state: string;
  landmark?: string;
  alternatePhone?: string;
  addressType: string;
  timeSort?: number;
  recentelyUsed?: boolean;
}

const address_SchemaDefinition: SchemaDefinition = {
  name: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
  locality: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    min: 10,
    max: 100,
  },
  cityDistrictTown: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    min: 10,
    max: 100,
  },
  alternatePhone: {
    type: String,
  },
  addressType: {
    type: String,
    required: true,
    enum: ["home", "work"],
  },
  timeSort: {
    type: Number,
  },
  recentelyUsed: {
    type: Boolean,
  },
};

const address_Schema = new mongoose.Schema<Address_DocumentType, Model<Address_DocumentType>>(address_SchemaDefinition);

//# ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//! final user address info////////////////////////////////////////////////////////////////////////////////////////////////////

export interface UserAddress_DocumentType extends Document {
  user: string;
  addressArr: Types.DocumentArray<Address_DocumentType>;
}

const userAddress_SchemaDefinition = {
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  addressArr: { type: [address_Schema] },
};

const userAddress = new mongoose.Schema<UserAddress_DocumentType, Model<UserAddress_DocumentType>>(userAddress_SchemaDefinition, {
  timestamps: true,
});
export default mongoose.model("Address", userAddress);

//# below is the conetent of a test about how to use subDocument with typescript
/* 
interface Test2 extends Document {
  name: string;
}

interface Test extends Document {
  docArr: [{ name: string }];
  singleNested: Schema<Test2, Model<Test2>> & Types.EmbeddedDocument;
}

const schema: Schema<Test, Model<Test>> = new Schema({
  docArr: [{ name: String }],
  singleNested: new Schema({ name: String }),
});

//# schema = {...new Schema methods}

const Models = mongoose.model("Test", schema);

//# mongoose.model => function()=> returns {new, ...model methods}

const testDoc = new Models({
  docArr: [{ name: "test1 without methods" }],
  singleNested: { name: "test2 with methods" },
});


 */
