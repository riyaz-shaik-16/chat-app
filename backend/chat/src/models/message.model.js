import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    chatId:{
        type:mongoose.Types.ObjectId,
        ref:"Chat",
        required:true
    },
    sender:{
        type:String,
        required:true,
    },
    text:String,
    image:{
        url:String,
        publicId:String
    },
    messageType:{
        type:String,
        enum:["text","image"],
        default:"text"
    },
    seen:{
        type:Boolean,
        default:false,
    },
    seenAt:{
        type:Date,
        default:null
    }
},{timestamps:true});

export default mongoose.model("message",messageSchema);