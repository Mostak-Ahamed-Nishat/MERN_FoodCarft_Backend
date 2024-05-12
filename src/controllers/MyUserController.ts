import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  // 1. First check if the user is exist or not

  try {
    const { auth0Id } = req.body;

    console.log("Your auth id is :");

    console.log(auth0Id);

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

export default {
  createCurrentUser,
};
