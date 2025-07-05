import asyncHandler from "../utils/AsyncHandler.js";
import { sendMessageService } from "../services/message.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const sendMessage = asyncHandler(async (req, res) => {
  const message = await sendMessageService(req.body);

  return res.status(200).json(new ApiResponse(200,message,"Message Sent Successfully!"));
});



export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;            
  const selectedUserId = req.params.id;   

  if (!selectedUserId) {
    throw new ApiError(400,"Selected user id is required!");
  }

  const conversation = await Conversation.findDirectConversation(userId, selectedUserId);
  if (!conversation) {
    return res.status(200).json(new ApiResponse(200,[],"Fetched Successfully!")); 
  }

  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .populate("senderId", "fullName picture")
    .populate("receiverId", "fullName picture");

  res.status(200).json(new ApiResponse(200,{messages},"Fetched Messages Succesfully!"));
});

