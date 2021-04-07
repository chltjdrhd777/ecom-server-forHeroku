import shortid from "shortid";
import { Request, Response } from "express";
import Admin, { UserBaseDocumentType } from "../model/UserModel";
import jwt from "jsonwebtoken";

export interface CustomAdminRequest extends Request<{}, {}, UserBaseDocumentType> {
  adminData?: any;
}

const register = (req: CustomAdminRequest, res: Response) => {
  Admin.findOne({ email: req.body.email }, null, null, (err, targetAdmin) => {
    //conditions/////
    if (err)
      return res.status(400).json({
        success: false,
        message: "cannot find one because of some errors",
      });

    if (targetAdmin) return res.status(400).json({ success: false, message: "Adminn already registered" });

    //after/////
    const { firstName, lastName, email, password, profileName } = req.body;
    const admin = new Admin({
      firstName,
      lastName,
      email,
      password,
      profileName: shortid.generate(),
      role: "admin",
    });

    admin.save().then((adminUpdated) => {
      if (!adminUpdated) return res.status(400).json({ success: false, message: "register failed" });

      return res.status(201).json({ success: true, message: "ok register is done", adminUpdated });
    });
  });
};

const login = (req: CustomAdminRequest, res: Response) => {
  Admin.findOne({ email: req.body.email }, null, null, (err, targetAdmin) => {
    //conditions/////
    if (err) return res.status(400).json({ success: false, message: "cannot find admin" });

    if (!targetAdmin) return res.status(400).json({ success: false, message: "no admin" });

    //after/////
    targetAdmin.authentification(req.body.password).then((isEqual) => {
      if (!isEqual) return res.status(400).json({ success: false, message: "wrong password" });

      const token = jwt.sign({ _id: targetAdmin._id, role: targetAdmin.role }, process.env.JWT_SECRET, { expiresIn: "3d" });
      targetAdmin.token = token;
      targetAdmin.save();
      let expireDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 3);
      res
        .cookie("authorized_admin", token, { expires: expireDate })
        .status(200)
        .json({ success: true, message: "login complete and token updated", targetAdmin });
    });
  });
};

const adminLogout = (req: CustomAdminRequest, res: Response) => {
  Admin.findOneAndUpdate({ _id: req.adminData._id }, { $set: { token: "" } }, { new: true }, (err, doc) => {
    if (err) return res.status(400).json({ err });
    res.clearCookie("authorized_admin");
    res.status(200).json({ message: "successfully logged out", doc });
  });
};

export { register, login, adminLogout };
