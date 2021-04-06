import { Address_DocumentType } from "../model/address";
import { Request, Response } from "express";
import UserAddress from "../model/address";
import { UserBaseDocumentType } from "../model/UserModel";

export interface CustomAddressRequest extends Request<{}, {}, { addressInfoToServer: Address_DocumentType; _id?: string }> {
  userData?: UserBaseDocumentType;
}

const addAddress = (req: CustomAddressRequest, res: Response) => {
  const { addressInfoToServer } = req.body;

  //# if you attach the new address in the request
  if (
    !addressInfoToServer.address ||
    !addressInfoToServer.name ||
    !addressInfoToServer.mobileNumber ||
    !addressInfoToServer.pinCode ||
    !addressInfoToServer.locality
  )
    return res.status(400).json({ message: "we didn't get the data required properly" });

  if (addressInfoToServer) {
    UserAddress.findOne(
      { user: req.userData._id, addressArr: { $elemMatch: { address: addressInfoToServer.address } } },
      undefined,
      undefined,
      (err, resultAddress) => {
        if (err) return res.status(400).json({ err });

        if (resultAddress) {
          return res.status(400).json({ message: "there is an already exist address" });
        } else {
          UserAddress.findOneAndUpdate(
            { user: req.userData._id },
            {
              $push: {
                addressArr: addressInfoToServer,
              },
            },
            { new: true, upsert: true, timestamps: true },
            (err, userAddress) => {
              if (err) return res.status(400).json({ err });
              return res.status(201).json({ userAddress });
            }
          );
        }
      }
    );
  } else return res.status(400).json({ errMessage: "there is no valid address required" });
};

const deleteAddress = (req: CustomAddressRequest, res: Response) => {
  UserAddress.updateOne({ user: req.userData._id }, { $pull: { addressArr: { _id: req.body._id } } }, { new: true }, (err, doc) => {
    if (err) return res.status(400).json({ err });
    return res.status(200).json({ doc });
  });
};

const getAddress = (req: CustomAddressRequest, res: Response) => {
  UserAddress.findOne({ user: req.userData._id }, undefined, undefined, (err, userAddress) => {
    if (err) return res.status(400).json({ err });
    if (userAddress === null)
      return res.status(200).json({
        userAddress: {
          user: "",
          addressArr: undefined,
        },
      });

    return res.status(200).json({
      userAddress: {
        user: userAddress.user,
        addressArr: userAddress.addressArr.sort((a, b) => {
          return b.timeSort - a.timeSort;
        }),
      },
    });
  });
};

const recentlyUsedAddress = (req: CustomAddressRequest, res: Response) => {
  UserAddress.findOne({ user: req.userData._id }, undefined, undefined, (err, doc) => {
    if (err) res.status(400).json({ err });

    //! if there is an property where there is "recentlyUsed" already
    if (doc.addressArr.some((eachAddress) => eachAddress.recentelyUsed)) {
      UserAddress.findOneAndUpdate(
        { user: req.userData._id, addressArr: { $elemMatch: { recentelyUsed: true } } },
        { $unset: { "addressArr.$.recentelyUsed": "" } },
        { new: true },
        (err) => {
          if (err) return res.status(400).json({ err });
        }
      );
    }

    //! then, add new recentlyUsed
    UserAddress.findOneAndUpdate(
      { user: req.userData._id, addressArr: { $elemMatch: { _id: req.body._id } } },
      { $set: { "addressArr.$.recentelyUsed": true } },
      { new: true, upsert: true },
      (err, doc) => {
        if (err) return res.status(400).json({ err });
        return res.status(201).json({ doc });
      }
    );
  });

  /*   UserAddress.findOneAndUpdate({user:req.userData._id,addressArr:{$elemMatch:{_id:req.body._id}}},{$set:{recentelyUsed:true}},{new:true,upsert:true}) */
};

export { addAddress, getAddress, deleteAddress, recentlyUsedAddress };
