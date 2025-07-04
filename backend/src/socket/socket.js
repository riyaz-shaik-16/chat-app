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

    socket.on("send_message", async ({ to, content, selectedUser }) => {
      try {
        const from = socket.userId;
        const { status, payload } = await sendMessageService({
          from,
          to,
          content,
        });

        const targetSocketId = await redisClient.hGet("online_users", to);
        if (targetSocketId) {
          io.to(targetSocketId).emit("receive_message", payload);
        }
        socket.emit("update_last_message",{to,content})

        socket.emit("message_sent", payload);
      } catch (err) {
        console.error("Message send error:", err.message);
        socket.emit("message_error", { error: err.message });
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

    // ✅ Manual logout
    socket.on("manual_logout", async () => {
      await redisClient.hDel("online_users", socket.userId);
      socket.leave(socket.userId);
      console.log(`${socket.userId} manually logged out`);
      await broadcastOnlineUsers();
    });

    // ✅ Disconnect
    socket.on("disconnect", async () => {
      await redisClient.hDel("online_users", socket.userId);
      socket.leave(socket.userId);
      console.log(`${socket.userId} disconnected`);
      await broadcastOnlineUsers();
    });
  });
};

export default init;
