import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limits: "16kb" }));
app.use(express.urlencoded({ extended: true, limits: "16kb" }));
app.use(express.static("Public"));


// Importing routes
import userRoute from "./Routes/userRoute.js";
import emailVerificationRoute from './Routes/emailVerificationRoute.js'

// Using routes
app.use("/api/v21/user", userRoute);
app.use("/api/v21/email-Verification" , emailVerificationRoute)

export{app}