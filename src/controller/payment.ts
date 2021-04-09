import { UserBaseDocumentType } from "../model/UserModel";
import { Request, Response } from "express";
import { Payment_DocumentType } from "../model/payment";
import Payment from "../model/payment";

export interface CustomPaymentRequest extends Request<{}, {}, Payment_DocumentType> {
  userData: UserBaseDocumentType;
}

const getPaymentInfo = (req: CustomPaymentRequest, res: Response) => {};

const createPaymentInfo = (req: CustomPaymentRequest, res: Response) => {
  res.status(201).json({ req: req.body, user: req.userData });
};

export { getPaymentInfo, createPaymentInfo };
