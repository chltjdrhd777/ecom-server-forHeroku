import { EachCartItemType } from "./../model/cart";
import Cart from "../model/cart";
import { UserBaseDocumentType } from "../model/UserModel";
import { Request, Response } from "express";

interface CustomCartRequest extends Request<{}, {}, { addedCartItem: EachCartItemType }> {
  userData: UserBaseDocumentType;
}

const createCart = (req: CustomCartRequest, res) => {
  Cart.findOne({ user: req.userData._id }, undefined, undefined, (err, doc) => {
    if (err) return res.status(400).json({ err });
    if (doc) {
      //if cart already exists && same item is exist already, change the quantity
      const addedItemId = req.body.addedCartItem._id;
      const isalreadyAdded = doc.cartItems.find((e) => e._id == addedItemId);
      let condition, action;

      if (isalreadyAdded) {
        condition = { user: req.userData._id, cartItems: { $elemMatch: { _id: addedItemId } } };
        action = {
          $set: { "cartItems.$.quantity": isalreadyAdded.quantity + req.body.addedCartItem.quantity },
        };
      } else {
        //there is a matched Item
        (condition = { user: req.userData._id }),
          (action = {
            $push: {
              cartItems: req.body.addedCartItem,
            },
          });
      }

      Cart.findOneAndUpdate(condition, action, { new: true }, (err, doc) => {
        if (err) return res.status(400).json({ err });
        res.status(200).json({ doc });
      });
    } else {
      //if there is not a cart with a specific userId
      //* make a cart data for this new user!
      const cart = new Cart({
        user: req.userData._id,
        cartItems: [req.body.addedCartItem],
      });

      cart.save(undefined, (err, doc) => {
        if (err) return res.status(400).json({ success: false, err });

        res.status(200).json({ success: true, doc });
      });
    }
  });
};

export { createCart };
