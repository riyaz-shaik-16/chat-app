import Message from "../models/message.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content, type = "text" } = req.body;

  const senderId = req.user._id;

  if (!receiverId || !content) {
    throw new ApiError(400, "receiverId and content are required");
  }

  const message = await Message.create({
    senderId,
    receiverId,
    content,
    type,
  });
  
  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message sent successfully"));
});

export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { otherUserId } = req.params;

  if (!otherUserId) {
    throw new ApiError(400, "otherUserId parameter is required");
  }

  const rawMessages = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).sort({ timestamp: 1 }).lean();

  const messages = rawMessages.map((msg) => ({
  _id: msg._id,
  from: msg.senderId,
  to: msg.receiverId,
  content: msg.content,
  timestamp: msg.timestamp,
}));

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages retrieved successfully"));
});
