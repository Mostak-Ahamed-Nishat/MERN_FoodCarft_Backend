import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user";

require("dotenv").config();

//Define a global variable type

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

//Validate the user authentication by Auth0 JWT checker
export const jwtCheck = auth({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_AUDIENCE_NAME,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: "HS256",
});

//Check the user if the user is valid find the user from db and store the auth0Id in locally
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  //If there is no authorization token throw error
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Authorization token is not found" });
  }

  //Get the token from the authorization EX:'Bearer ldkjalsd'
  const token = authorization.split(" ")[1];

  try {
    //Decode the token
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    //we will get the id from as sub variable
    const auth0Id = decoded.sub;
    //Find the user from the database
    const user = await User.findOne({ auth0Id });

    //If the user doesn't exist in the database
    if (!user) {
      return res.status(401).json({ message: "Authorized user doesn't exist" });
    }

    //Set the userId and auth0Id to req
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authorization token is not valid" });
  }
};
