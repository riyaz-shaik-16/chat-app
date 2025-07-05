import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js"

export const getSidebarUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id.toString();

  const [conversations, allOtherUsers] = await Promise.all([
    Conversation.findByParticipant(currentUserId).populate("lastMessage.senderId", "name picture"),
    User.find({ _id: { $ne: currentUserId } }).select("_id fullName picture").lean(),
  ]);

  const conversationMap = new Map();

  conversations.forEach((convo) => {
    const otherUserId = convo.participants.find(
      (id) => id.toString() !== currentUserId
    );
    conversationMap.set(otherUserId.toString(), convo);
  });

  const sidebarUsers = allOtherUsers.map((user) => {
    const convo = conversationMap.get(user._id.toString());

    const lastMessage = convo?.lastMessage?.content
      ? {
          content: convo.lastMessage.content,
          type: convo.lastMessage.type,
          timestamp: convo.lastMessage.timestamp,
          sender: {
            _id: convo.lastMessage.senderId?._id,
            name: convo.lastMessage.senderId?.name,
            picture: convo.lastMessage.senderId?.picture,
          },
        }
      : null;

    const unreadCount = convo?.unreadCounts?.[currentUserId] || 0;

    return {
      _id: user._id,
      name: user.fullName,
      picture: user.picture,
      lastMessage,
      unreadCount,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, { users: sidebarUsers }, "Fetched Successfully!")
  );
});


