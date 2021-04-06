import { UserBaseDocumentType } from "./../model/UserModel";
import slugify from "slugify";
import { ProductBaseDocumentType } from "../model/product";
import { Request, Response } from "express";
import Product from "../model/product";
import Category from "../model/category";

export interface CustomProductRequest extends Request<{}, {}, ProductBaseDocumentType> {
  adminData: UserBaseDocumentType;
  files: Express.Multer.File[];
}

const createProduct = (req: CustomProductRequest, res: Response) => {
  /*  res.status(200).json({ files: req.files, admin: req.adminData, body: req.body }); */
  const { name, price, description, category, quantity } = req.body;

  let productPictures = [] as { img: string }[];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    productPictures,
    category,
    createdBy: req.adminData._id,
    quantity,
  });

  console.log(product);

  product.save(undefined, (err, doc) => {
    if (err) return res.status(400).json({ err });
    console.log(doc);
    return res.status(200).json({ doc });
  });

  /*   product.save(undefined, (err, doc) => {
    if (err) return res.status(400).json({ success: false, err });

    res.status(200).json({ success: true, doc });
  }); */
};

const getProduct = (req: Request, res: Response) => {
  try {
    Product.find({})
      .populate("category", "_id name")
      .then((result) => res.status(200).json({ success: true, productList: result }));
  } catch (err) {
    if (err) return res.status(400).json({ success: false, message: "bed request" });
  }
  /*   Product.find({}, (err, docs) => {
    if (err) return res.status(400).json({ success: false, message: "can't get product lists" });

    res.status(200).json({ success: true, productList: docs });
  }); */
};

const getProductBySlug = (req: Request, res: Response) => {
  const { slug } = req.params;

  Category.findOne({ slug: slug })
    .select("_id")
    .exec((err, target) => {
      if (err) return res.status(400).json({ err });
      if (target) {
        Product.find({ category: target._id }, undefined, undefined, (err, docs) => {
          if (err) res.status(400).json({ err });

          if (docs.length !== undefined && docs.length > 0) {
            const productByPrice = {
              under10: docs.filter((doc) => {
                const renderedPrice = parseInt(doc.price.split(",")[0]);
                return renderedPrice <= 10;
              }),
              is10to15: docs.filter((doc) => {
                const renderedPrice = parseInt(doc.price.split(",")[0]);
                return renderedPrice > 10 && renderedPrice <= 15;
              }),
              is15to20: docs.filter((doc) => {
                const renderedPrice = parseInt(doc.price.split(",")[0]);
                return renderedPrice > 15 && renderedPrice <= 20;
              }),
              over20: docs.filter((doc) => {
                const renderedPrice = parseInt(doc.price.split(",")[0]);
                return renderedPrice > 20;
              }),
            };

            res.status(200).json({ docs, productByPrice });
          }
        });
      }
    });
};

const getProductById = (req: Request, res: Response) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }, undefined, undefined, (err, result) => {
      if (err) return res.status(400).json({ err });

      return res.status(200).json({ result });
    });
  }
};

export { createProduct, getProduct, getProductBySlug, getProductById };
