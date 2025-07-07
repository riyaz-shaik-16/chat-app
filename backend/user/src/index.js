import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import { redisClient } from "./config/redisClient.js";
import { connectRabbitMQ } from "./config/rabbitMQ.js";
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.route.js"
import cors from "cors"



export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:process.env.FRONTEND_URI,
  withCredentials:true,
}))

app.use("/api/user",userRoutes);

const port = process.env.port || 6000;

(async () => {
  try {
    await connectDB();
    console.log("Mongodb connected!");
    await redisClient.connect();
    console.log("Redis connected!");
    await connectRabbitMQ();
    console.log("RabbitMQ connected!");
    app.listen(port, () => {
      console.log(`app listening on port: ${port}`);
    });
  } catch (error) {
    console.log("Error in start server: ", error);
    process.exit(1);
  }
})();
