import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";
import myRestaurantRoute from "./routes/myRestaurantRoute";
import restaurantRoute from "./routes/restaurantRoute";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

const app = express();
const port = process.env.PORT;

//Global Middleware
app.use(cors());
app.use(express.json());

//*****Database connection*****
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) =>
    console.log("Database connection failed :" + error.message)
  );

//*****Cloudinary Connection*****
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ****APIs*****
//Site health check API
app.get("/health", async (req: Request, res: Response) => {
  res.send({
    message: "Health Ok !",
  });
});
//User API
app.use("/api/my/user", myUserRoute);
//Restaurant API
app.use("/api/my/restaurant", myRestaurantRoute);
//Restaurant API
app.use("/api/restaurant", restaurantRoute);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
