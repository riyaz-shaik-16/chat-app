import express from "express";
import dotenv from "dotenv";
import { sendOtp } from "./consumer.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

sendOtp()

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})