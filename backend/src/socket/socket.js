import redisClient from "../config/redisClient.js";
import { sendMessageService } from "../services/message.service.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Conversation from "../models/conversation.model.js";

const init = (io) => {
  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error("No cookies found"));

      const parsedCookies = cookie.parse(cookies);
      const token = parsedCookies.token;
      if (!token) return next(new Error("Token not found"));

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;

      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const getQueueKey = (userId) => `unseenMessages:${userId}`;

    const broadcastOnlineUsers = async () => {
      const users = await redisClient.hKeys("online_users");
      io.emit("online_users_list", users);
    };

    console.log("✅ User connected:", socket.id, "UserId:", socket.userId);

    socket.join(socket.userId);

    await redisClient.hSet("online_users", socket.userId, socket.id);

    const queuedMessages = await redisClient.lRange(
      getQueueKey(socket.userId),
      0,
      -1
    );
    if (queuedMessages.length > 0) {
      queuedMessages.forEach((msg) => {
        socket.emit("receive_message", JSON.parse(msg));
      });
      await redisClient.del(getQueueKey(socket.userId));
    }

    await broadcastOnlineUsers();

    socket.on("send_message", async ({ to, content, type = "text" }) => {
      try {
        console.log("From: ", socket.userId);
        console.log("to: ", to);
        const from = socket.userId;

        const senderSelectedUser = await redisClient.get(`active_chat:${from}`);
        console.log("Sender selected user: ", senderSelectedUser);

        const message = await sendMessageService({
          from,
          to,
          content,
          type,
          selectedUser: senderSelectedUser,
        });

        let conversation = await Conversation.findDirectConversation(from, to);
        if (!conversation) {
          conversation = await Conversation.createDirectConversation(from, to);
        }

        await conversation.updateLastMessage({
          content: message.content,
          senderId: from,
          type: type,
        });

        const targetSocketId = await redisClient.hGet("online_users", to);
        console.log("Target Socket id: ", targetSocketId);

        if (targetSocketId) {
          console.log("Recipient is online");

          const recipientSelectedUser = await redisClient.get(
            `active_chat:${to}`
          );
          console.log("Recipient selected user: ", recipientSelectedUser);

          io.to(targetSocketId).emit("receive_message", message);

          if (recipientSelectedUser === from) {
            console.log(
              "Recipient has this chat selected - no unread count increment"
            );

            io.to(targetSocketId).emit("update_lastmessage", {
              id: from,
              content: message.content,
              timestamp: message.timestamp,
              sender: from,
              type: type,
            });
          } else {
            console.log(
              "Recipient online but different chat selected - increment unread count"
            );

            await conversation.incrementUnreadCount(to);

            socket.emit("update_lastmessage", {
              id: from,
              content: message.content,
              timestamp: message.timestamp,
              sender: from,
              type: type,
              incrementUnread: true,
            });
          }
        } else {
          console.log(
            "Recipient is offline - increment unread count and save to DB"
          );

          await conversation.incrementUnreadCount(to);
          await redisClient.lPush(
            `offline_messages:${to}`,
            JSON.stringify({
              ...message,
              delivered: false,
            })
          );
        }

        if (senderSelectedUser !== to) {
          console.log("Sender not in this chat - update their unread count");
          socket.emit("update_unreadcount", { to });
        }

        console.log("Message: ", message);
        socket.emit("message_sent", message);
      } catch (err) {
        console.error("Message send error:", err.message);
        socket.emit("message_error", { error: err.message });
      }
    });

    socket.on("active_chat", async ({ selectedUser }) => {
      try {
        await redisClient.set(`active_chat:${socket.userId}`, selectedUser);

        const convo = await Conversation.findDirectConversation(
          socket.userId,
          selectedUser
        );

        console.log("Convo: ", convo);
        if (!convo) {
          console.warn(
            `No conversation found between ${socket.userId} and ${selectedUser}`
          );
          return;
        }

        await convo.resetUnreadCount(socket.userId);
      } catch (err) {
        console.error("Error handling active_chat event:", err);
      }
    });

    socket.on("mark_seen", async ({ conversationId }) => {
      const userId = socket.userId;
      try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        conversation.unreadCounts.set(userId, 0);
        await conversation.save();
      } catch (err) {
        console.error("Error marking seen:", err);
      }
    });

    socket.on("typing", ({ to }) => {
      console.log("Typing trigerred!!!");
      io.to(to).emit("typing", { from: socket.userId });
    });

    socket.on("stop_typing", ({ to }) => {
      console.log("Typing stopped!!");
      io.to(to).emit("stop_typing", { from: socket.userId });
    });

    socket.on("manual_logout", async () => {
      await redisClient.hDel("online_users", socket.userId);
      socket.leave(socket.userId);
      console.log(`${socket.userId} manually logged out`);
      await broadcastOnlineUsers();
    });

    socket.on("disconnect", async () => {
      await redisClient.hDel("online_users", socket.userId);
      await redisClient.del(`active_chat:${socket.userId}`);
      socket.leave(socket.userId);
      console.log(`${socket.userId} disconnected`);
      await broadcastOnlineUsers();
    });
  });
};

export default init;
