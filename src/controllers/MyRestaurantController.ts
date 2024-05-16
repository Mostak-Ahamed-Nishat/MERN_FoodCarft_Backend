import express, { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

export const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    //User can only create only one restaurant so check is the user has already an restaurant or not
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res.status(409).json({
        message: "Ops! Can't create more than one restaurant! ",
      });
    }

    //Get the image

    const image = req.file as Express.Multer.File;

    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //upload image and get the image url
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    //Get the data from the body and create a new restaurant
    const restaurant = new Restaurant(req.body);
    //Embed the image url
    restaurant.imageUrl = uploadResponse.url;

    //set the current user to the restaurant
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    //Create Restaurant
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong or creating restaurant !",
    });
  }
};

export default {
  createMyRestaurant,
};
