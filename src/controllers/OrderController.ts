import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/Restaurant";
import Order from "../models/Order";
// require("dotenv").config();

const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL_REDIRECT_AFTER_PAYMENT_SUCCESS;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

//*********** */
const getMyOrder = async (req: Request, res: Response) => {
  try {
    //get all the order that the current user ordered
    const orders = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong !",
    });
  }
};

//*********Get the Stripe WebHook
const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );

    if (event.type === "checkout.session.completed") {
      //If the order successfully completed and paid then find the order id
      const order = await Order.findById(event.data.object.metadata?.orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      //Add the data to order schema
      order.totalAmount = event.data.object.amount_total;
      order.status = "paid";

      await order.save();
    }

    res.status(200).send();
  } catch (error: any) {
    res.status(400).send(`WebHook Error: ${error.message}`);
  }
};

//*********Create an order
const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    //Get the data from body
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    //FInd the restaurant that want to order your food
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    //If the restaurant not found
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    //Create line item to let show the item on the stripe page
    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    //Send the data to order model
    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    //Send data to stripe
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    //Save the order now at DB
    await newOrder.save();

    if (!session.url) {
      return res.status(500).json({
        message: "Error creating stripe session",
      });
    }

    //Return session to the frontend
    return res.json({
      url: session.url,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

//createLineItems functions
const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  //1. foreach cartItem, get the menuItem object from the restaurant
  //2. foreach cartItem, convert it to a stripe line item
  //3. return line item array
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() == cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem?.name || "",
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

//Session for sending stripe

// const createSession = async (
//   lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
//   orderId: string,
//   deliveryPrice: number,
//   restaurantId: string
// ) => {
//   const sessionData = await stripe.checkout.sessions.create({
//     line_items: lineItems,
//     shipping_options: [
//       {
//         shipping_rate_data: {
//           display_name: "Delivery",
//           type: "fixed_amount",
//           fixed_amount: {
//             amount: deliveryPrice,
//             currency: "usd",
//           },
//         },
//       },
//     ],
//     mode: "payment",
//     metadata: {
//       orderId,
//       restaurantId,
//     },
//     success_url: `${FRONTEND_URL}/order-status?success=true`,
//     cancel_url: `${FRONTEND_URL}/details/${restaurantId}?cancelled=true`,
//   });

//   return sessionData;
// };

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  console.log("Creating session with metadata:", {
    orderId,
    restaurantId,
  });

  const sessionData = await stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "usd",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/details/${restaurantId}?cancelled=true`,
  });

  console.log("Session created:", sessionData);
  return sessionData;
};

export default {
  createCheckoutSession,
  stripeWebhookHandler,
  getMyOrder,
};
