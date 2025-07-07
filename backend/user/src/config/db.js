import mongoose from "mongoose";

const connectDB = async () => {
    const url = process.env.MONGODB_URI;
    if(!url) throw new Error("Mongodb uri not defined!");

    try {
        await mongoose.connect(url,{
            dbName:"chat-app-using-microservices"
        })
    } catch (error) {
        console.log("Error in connecting to mongodb: ",error.message); 
        process.exit(1);
    }
}

export default connectDB;