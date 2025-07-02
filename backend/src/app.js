import express from "express";
import cookieParser from "cookie-parser"
import { createServer } from "http";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import "./config/passport.js";
import { connectMONGODB } from "./config/db.js";
import redisClient from "./config/redisClient.js";
import { Server } from "socket.io";
import init from "./socket/socket.js"
import errorHandler from "./middlewares/errorHandler.js";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(errorHandler)
app.use(cookieParser())
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoutes);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

init(io);

app.get("/", (req, res) => {
  res.send("Hello!");
});

const startServer = async () => {
  try {
    await connectMONGODB();
    console.log("✅ MongoDB connected");

    await redisClient.connect();
    console.log("✅ Redis connected");

    server.listen(9000, () => {
      console.log("🚀 Server running at http://localhost:9000");
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

startServer();

export default io;


