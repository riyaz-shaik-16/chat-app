import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import chatRoutes from "./routes/chat.route.js";
import cors from "cors";
import { app, server } from "./config/socket.js";

dotenv.config();

connectDb();

app.use(express.json());

app.use(cors({
  origin:process.env.FRONTEND_URI,
  credentials:true
}));

app.use("/api/v1", chatRoutes);

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Chat service running!");
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
