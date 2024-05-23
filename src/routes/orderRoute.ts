import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

//create Checkout
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
);

export default router;
