import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../model/UserModel";
import { Request, Response } from "express";
import multer from "multer";
import shortid from "shortid";
import path from "path";

const formValidators = [
  check("firstName").notEmpty().withMessage("firstName is required"),
  check("lastName").notEmpty().withMessage("lastName is reqruied"),
  check("email").isEmail().withMessage("valid email is required"),
  check("password").isLength({ min: 6 }).withMessage("password must be at least 6 charater long"),
];

const formLoginValidators = [
  check("email").isEmail().withMessage("valid email is required"),
  check("password").isLength({ min: 6 }).withMessage("password must be at least 6 charater long"),
];

const validatedResult = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ err: errors.array()[0].msg });
  } else {
    next();
  }
};

const requiredAdminAuth = (req, res, next) => {
  const token = req.cookies.authorized_admin;
  const verifiedCheck: any = jwt.verify(token, process.env.JWT_SECRET);

  if (!token || !verifiedCheck) {
    res.status(400).json({ success: false, massage: "you are not verified" });
  } else {
    User.findOne({ _id: verifiedCheck._id }, undefined, undefined, (err, doc) => {
      if (doc.role !== "admin") return res.status(400).json({ success: false, message: "you are not an admin" });
      req.adminData = doc;
      next();
    });
  }
};

const tokenVerificationCheck = (req: Request, res: Response) => {
  const tokenName = req.body.tokenName;
  const tokenValue = req.body.tokenValue;
  const verifiedCheck = jwt.verify(tokenValue, process.env.JWT_SECRET);

  if (!tokenValue || !verifiedCheck) {
    res.clearCookie(tokenName);
  } else {
    res.json({ message: "your token is alive" });
  }
};

const requiredUserAuth = (req, res, next) => {
  const token = req.cookies.authorized_user;
  const verifiedCheck: any = jwt.verify(token, process.env.JWT_SECRET);

  if (!token || !verifiedCheck) {
    res.status(400).json({ success: false, massage: "you are not verified" });
  } else {
    User.findOne({ _id: verifiedCheck._id }, undefined, undefined, (err, doc) => {
      if (doc.role !== "user") return res.status(400).json({ success: false, message: "you are not an user" });
      req.userData = doc;
      next();
    });
  }
};

const uploadPictures = (option: "array" | "single") => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, `${shortid.generate()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });

  if (option === "array") {
    return upload.array("productPictures");
  } else if (option === "single") {
    return upload.single("categoryImage");
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${shortid.generate()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export { formValidators, formLoginValidators, validatedResult, requiredAdminAuth, requiredUserAuth, uploadPictures, tokenVerificationCheck };
