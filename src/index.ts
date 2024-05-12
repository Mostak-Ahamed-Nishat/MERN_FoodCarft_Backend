import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();
const port = process.env.PORT;

//connect mongoose
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) =>
    console.log("Database connection failed :" + error.message)
  );

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "You can do it",
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
