import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
    path: "../../.env"
});

const connectMONGODB = async ( ) => {
    mongoose.connect(process.env.MONGODB_URI)
}

export {  connectMONGODB }; 

