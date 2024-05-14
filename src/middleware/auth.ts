import { auth } from "express-oauth2-jwt-bearer";
require("dotenv").config();

export const jwtCheck = auth({
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_AUDIENCE_NAME,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
  tokenSigningAlg: "HS256",
});
