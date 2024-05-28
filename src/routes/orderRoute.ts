import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

//Get the order details after order food
router.get("/", jwtCheck, jwtParse, OrderController.getMyOrder);

//create Checkout
router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
);

//Check webhook
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router;
