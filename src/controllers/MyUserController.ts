import { Request, Response, response } from "express";
import User from "../models/user";

//Get the current user data
const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });

    if (!currentUser) {
      return res.status(401).json({
        message: "Unauthorized Access ! User not found",
      });
    }

    return res.status(201).json(currentUser);
  } catch (error) {
    return res.status(401).json({
      message: "Something went wrong to get the current user data",
    });
  }
};

// Create a user
const createCurrentUser = async (req: Request, res: Response) => {
  // 1. First check if the user is exist or not
  try {
    const { auth0Id } = req.body;

    //Check in the database is the user is already exist or not
    const existingUser = await User.findOne({ auth0Id });

    //If the user exist in the DB
    if (existingUser) {
      return res.status(200).send();
    }

    // 2. If the user doesn't exist create an user
    const newUser = new User(req.body);
    await newUser.save();

    // 3. Return the user object to the calling client

    res.status(201).json(newUser.toObject());
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user.",
    });
  }
};

//Update user information
const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    //Get the data from the request body
    const { name, addressLine1, country, city } = req.body;

    //find the user in the database

    const user = await User.findById(req.userId);

    //If user not found

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    //Update and save the data to db
    await user.save();
    //send response data
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update information",
    });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
  getCurrentUser,
};
