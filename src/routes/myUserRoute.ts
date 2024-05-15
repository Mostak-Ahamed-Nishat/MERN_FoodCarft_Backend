import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

//Create a user
router.post("/", jwtCheck, MyUserController.createCurrentUser);

//Update the user information
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);
//Get the user data
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

export default router;
