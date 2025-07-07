import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    users: [{
        type: String
      }],
    latestMessage: {
      text: String,
      sender:String
    },
},{ timestamps: true });

export default mongoose.model("chat", chatSchema);
