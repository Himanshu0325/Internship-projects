import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

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
import ActivityLogsRoute from './Routes/ActivityLogsRoute.js'
import { User } from "./Models/userModel.js";

// Using routes
app.use("/api/v21/user", userRoute);
app.use("/api/v21/email-Verification" , emailVerificationRoute)
app.use("/api/v21/Activity-log" , ActivityLogsRoute )

// Setup socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
});

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  // Periodically check user status
  const interval = setInterval(async () => {
    const user = await User.findById(userId);
    if (user && !user.status) {
      socket.emit("logout");
      clearInterval(interval);
      socket.disconnect();
    }
  }, 30000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("User disconnected:", userId);
  });
});


// Export httpServer instead of app for listening
export { httpServer, app };