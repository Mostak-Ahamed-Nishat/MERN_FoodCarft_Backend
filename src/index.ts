import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute";

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) =>
    console.log("Database connection failed :" + error.message)
  );

// API
app.use("/api/my/user", myUserRoute);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
