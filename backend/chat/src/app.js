console.log("app started from heree")
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.use(cookieParser());

// app.use(cors());
const port = process.env.PORT || 5002;

app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/message",messageRoutes)

;(async () => {
    try {
      await connectDB();
      console.log("Mongodb connected!");
      app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
      });
    } catch (error) {
        console.log("Error in index.js: ",error);
        process.exit(1);
    }
})();




