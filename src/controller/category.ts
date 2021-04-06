import { Request, Response } from "express";
import { CategoryBaseDocumentType } from "../model/category";
import slugify from "slugify";
import Category from "../model/category";
import { UserBaseDocumentType } from "../model/UserModel";

export interface CustomCategorytRequest extends Request<{}, {}, CategoryBaseDocumentType> {
  adminData: UserBaseDocumentType;
  files: Express.Multer.File[];
}

const createCategory = (req: CustomCategorytRequest, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name),
    parentId: undefined,
    categoryImage: undefined,
  };

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  if (req.file) {
    /*    categoryObj.categoryImage = `${process.env.HOSTAPI}/public/${req.file.filename}`; */

    categoryObj.categoryImage = `/public/${req.file.filename}`;
  }

  const cat = new Category(categoryObj);

  cat.save(undefined, (err, doc) => {
    if (err) return res.status(400).json({ success: false, message: "cannot store category data", err });

    return res.status(201).json({ success: true, message: "successfully stored", doc });
  });
};

const categoryListRenderFunc = (_req: Request, res: Response, status: number) => {
  Category.find({}, (err, docs) => {
    if (err) return res.status(400).json({ err });

    const makingCategoryTree = (docs, parentId = undefined) => {
      interface DataType {
        _id: string;
        name: string;
        slug: string;
        parentId?: string;
        type?: string;
        children?: DataType[];
      }
      let categoryList = [];
      let data: DataType[];

      if (parentId === undefined) {
        data = docs.filter((doc) => doc.parentId === undefined);
      } else {
        data = docs.filter((doc) => doc.parentId === parentId);
      }

      for (let each of data) {
        let targetDataForPush = {
          _id: each._id,
          name: each.name,
          slug: each.slug,
          parentId: each.parentId,
          type: each.type,
          children: makingCategoryTree(docs, each._id.toString()),
        };

        categoryList.push(targetDataForPush);
      }

      return categoryList;
    };
    const categoryList = makingCategoryTree(docs);

    res.status(status).json({ success: true, categoryList });
  });
};

const getCategory = (req, res) => {
  categoryListRenderFunc(undefined, res, 200);
};

const updateCategory = async (req: CustomCategorytRequest, res: Response) => {
  const { _id, name, parentId, type } = req.body;

  for (let index in name) {
    const updatedCategory = {
      name: name[index],
      slug: slugify(name[index]),
    };

    if (parentId[index] !== "undefined") {
      updatedCategory["parentId"] = parentId[index];
    }

    if (type[index] !== "undefined") {
      updatedCategory["type"] = type[index];
    }

    await Category.findOneAndUpdate({ _id: _id[index] }, updatedCategory, { new: true }, (e, d) => {});
  }

  categoryListRenderFunc(undefined, res, 201);
};

const deleteCategories = (req: Request, res: Response) => {
  try {
    for (let eachCate of req.body) {
      Category.findOneAndDelete({ _id: eachCate.value }, undefined, (err, doc) => {});
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

export { createCategory, getCategory, updateCategory, deleteCategories };
