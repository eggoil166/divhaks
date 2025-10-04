import express from "express";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
});