import { Request, Response } from "express";
import User, { UserBaseDocumentType } from "../model/UserModel";
import jwt from "jsonwebtoken";
import shortid from "shortid";

export interface CustomUserRequest extends Request<{}, {}, UserBaseDocumentType> {
  userData?: any;
}

const register = (req: CustomUserRequest, res: Response) => {
  User.findOne({ email: req.body.email }, null, null, (err, targetUser) => {
    //conditions/////
    if (err)
      return res.status(400).json({
        success: false,
        message: "cannot find one because of some errors",
      });

    if (targetUser) return res.status(400).json({ success: false, message: "User already registered" });

    //after/////
    const { firstName, lastName, email, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      profileName: shortid.generate(),
    });

    user.save().then((userdata) => {
      if (!userdata) return res.status(400).json({ success: false, message: "register failed" });

      const resData = { role: userdata.role, email: userdata.email, _id: userdata._id };
      return res.status(201).json({ success: true, message: "ok register is done", resData });
    });
  });
};

const login = (req: CustomUserRequest, res: Response) => {
  User.findOne({ email: req.body.email }, null, null, (err, targetUser) => {
    //conditions/////
    if (err) return res.status(400).json({ success: false, message: "cannot login" });

    if (!targetUser) return res.status(400).json({ success: false, message: "no user" });

    if (targetUser.role !== "user") return res.status(400).json({ success: false, message: "admin cannot log in from here" });

    //after/////
    targetUser.authentification(req.body.password).then((isEqual) => {
      if (!isEqual) return res.status(400).json({ success: false, message: "wrong password" });

      const token = jwt.sign({ _id: targetUser._id, role: targetUser.role }, process.env.JWT_SECRET, { expiresIn: "3d" });
      targetUser.token = token;
      targetUser.save();
      let expireDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 3);
      res
        .cookie("authorized_user", token, { expires: expireDate, secure: true, sameSite: "none" })
        .status(200)
        .json({ success: true, message: "login complete and token updated", targetUser });
    });
  });
};

const logout = (req: CustomUserRequest, res: Response) => {
  User.findOneAndUpdate({ _id: req.userData._id }, { $set: { token: "" } }, { new: true }, (err, doc) => {
    if (err) return res.status(400).json({ err });
    res.clearCookie("authorized_user");
    res.status(200).json({ message: "successfully logged out", doc });
  });
};

export { register, login, logout };
