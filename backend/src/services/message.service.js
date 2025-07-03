import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import redisClient from "../config/redisClient.js";
import mongoose from "mongoose";

export const sendMessageService = async ({
  from,
  to,
  content,
  type = "text",
}) => {
  if (!from || !to || !content?.trim()) {
    throw new Error("Invalid message payload");
  }

  const participants = [from, to]
    .map((id) => new mongoose.Types.ObjectId(id))
    .sort();

  console.log("Participants: ", participants[0], " - ", participants[1]);

  const conversation = await Conversation.findOneAndUpdate(
    {
      participants: {
        $all: [
          { $elemMatch: { $eq: participants[0] } },
          { $elemMatch: { $eq: participants[1] } },
        ],
      },
    },
    {
      $setOnInsert: {
        participants: participants, // ✅ explicitly set participants to avoid Mongo error
        unreadCounts: {
          [to]: 0,
          [from]: 0,
        },
        lastMessage: {}, // optional init, safe default
      },
    },
    { new: true, upsert: true }
  );

  const savedMessage = await Message.create({
    senderId: from,
    receiverId: to,
    content,
    type,
    status: "sent",
    conversationId: conversation._id,
  });

  conversation.lastMessage = {
    content,
    senderId: from,
    type,
    timestamp: savedMessage.createdAt,
  };

  // Increase unread count for the receiver
  conversation.unreadCounts.set(
    to,
    (conversation.unreadCounts.get(to) || 0) + 1
  );

  await conversation.save();

  const payload = {
    _id: savedMessage._id,
    from,
    to,
    content,
    type,
    timestamp: savedMessage.createdAt,
    status: savedMessage.status,
  };

  const isOnline = await redisClient.hExists("online_users", to);

  if (isOnline) {
    return { status: "online", payload };
  } else {
    await redisClient.rPush(`unseenMessages:${to}`, JSON.stringify(payload));
    return { status: "queued", payload };
  }
};
