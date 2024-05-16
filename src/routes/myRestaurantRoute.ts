import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

//Create a restaurant
router.post(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  upload.single("imageFile"),
  MyRestaurantController.createMyRestaurant
);

export default router;
