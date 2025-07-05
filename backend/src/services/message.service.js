import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import ApiError from "../utils/ApiError.js";

export const sendMessageService = async ({
  from,
  to,
  content,
  type = "text",
  selectedUser = null,
}) => {
  if (!from || !to || !content?.trim()) {
    throw new ApiError(400, "Missing required fields");
  }

  let conversation = await Conversation.findDirectConversation(from, to);
  if (!conversation) {
    conversation = await Conversation.createDirectConversation(from, to);
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId: from,
    receiverId: to,
    content: content.trim(),
    type,
  });

  await conversation.updateLastMessage({
    content: message.content,
    senderId: from,
    type: message.type,
  });

  if (selectedUser !== to) {
    await conversation.incrementUnreadCount(to);
  }

  return message;
};
