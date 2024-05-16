import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName")
    .notEmpty()
    .isString()
    .withMessage("Please provide valid name"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  body("deliveryPrice")
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Price must be positive number"),
  body("estimatedDeliveryTime")
    .isFloat({ min: 0 })
    .withMessage("Time must be positive integer"),
  body("cuisine").notEmpty().isArray().withMessage("Cuisine must be an array"),
  body("menuItems")
    .isArray()
    .notEmpty()
    .withMessage("Menu items must be an array"),
  body("menuItems.*.name")
    .notEmpty()
    .isString()
    .withMessage("Name must be valid string"),
  body("menuItems.*.price")
    .notEmpty()
    .isFloat({ min: 1 })
    .withMessage("Price must be positive number"),
  handleValidationErrors,
];
