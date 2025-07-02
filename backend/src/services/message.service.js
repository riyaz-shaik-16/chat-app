import Message from "../models/message.model.js";
import redisClient from "../config/redisClient.js";

export const sendMessageService = async ({ from, to, content }) => {
  if (!from || !to || !content?.trim()) {
    throw new Error("Invalid message payload");
  }

  const savedMessage = await Message.create({
    senderId: from,
    receiverId: to,
    content,
    timestamp: new Date(),
  });

  const payload = {
    _id: savedMessage._id,
    from,
    to,
    content,
    timestamp: savedMessage.timestamp,
  };

  const isOnline = await redisClient.hExists("online_users", to);

  if (isOnline) {
    return { status: "online", payload };
  } else {
    await redisClient.rPush(`unseenMessages:${to}`, JSON.stringify(payload));
    return { status: "queued", payload };
  }
};
