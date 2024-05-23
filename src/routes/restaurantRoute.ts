import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

//Get single restaurant
router.get(
  "/:restaurantId",
  param("restaurantId")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("RestaurantId must be a valid string"),
  RestaurantController.getRestaurant
);

//Search Router
router.get(
  "/search/:city",
  param("city")
    .isString()
    .notEmpty()
    .withMessage("City parameter must be a valid string"),
  RestaurantController.searchRestaurant
);

export default router;
