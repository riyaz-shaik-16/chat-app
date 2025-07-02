import redisClient from "../config/redisClient.js";
import { sendMessageService } from "../services/message.service.js";

const init = (io) => {
  io.on("connection", async (socket) => {
    const getQueueKey = (username) => `unseenMessages:${username}`;

    const broadcastOnlineUsers = async () => {
      const users = await redisClient.hKeys("online_users");
      io.emit("online_users_list", users);
    };

    console.log("User connected:", socket.id);

    socket.on("register", async (userName) => {
      try {
        socket.username = userName;

        socket.join(userName);

        const isAlreadyOnline = await redisClient.hExists(
          "online_users",
          userName
        );
        if (!isAlreadyOnline) {
          await redisClient.hSet("online_users", userName, "true");
          console.log(`${userName} registered and joined room ${userName}`);
        } else {
          console.log(`${userName} is already online`);
        }

        const queuedMessages = await redisClient.lRange(
          getQueueKey(userName),
          0,
          -1
        );
        if (queuedMessages.length > 0) {
          queuedMessages.forEach((msg) => {
            socket.emit("receive_message", JSON.parse(msg));
          });
          await redisClient.del(getQueueKey(userName));
        }

        await broadcastOnlineUsers();
      } catch (err) {
        console.error("Error in register:", err.message);
      }
    });

    socket.on("send_message", async ({ to, content }) => {
      try {
        const from = socket.username;

        const { status, payload } = await sendMessageService({
          from,
          to,
          content,
        });

        if (status === "online") {
          io.to(to).emit("receive_message", payload);
        }
        socket.emit("message_sent", payload);
      } catch (err) {
        console.error("Private message error:", err.message);
        socket.emit("message_error", { error: err.message });
      }
    });

    socket.on("typing", async ({ to }) => {
      try {
        io.to(to).emit("typing", { from: socket.username });
      } catch (err) {
        console.error("Error in typing:", err.message);
      }
    });

    socket.on("stop_typing", async ({ to }) => {
      try {
        io.to(to).emit("stop_typing", { from: socket.username });
      } catch (err) {
        console.error("Error in stop_typing:", err.message);
      }
    });

    socket.on("manual_logout", async () => {
      try {
        if (socket.username) {
          await redisClient.hDel("online_users", socket.username);
          socket.leave(socket.username);
          console.log(`${socket.username} manually logged out`);
          await broadcastOnlineUsers();
        }
      } catch (err) {
        console.error("Error in manual_logout:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      try {
        if (socket.username) {
          await redisClient.hDel("online_users", socket.username);
          socket.leave(socket.username);
          console.log(`${socket.username} disconnected`);
          await broadcastOnlineUsers();
        }
      } catch (err) {
        console.error("Error in disconnect:", err.message);
      }
    });

    await broadcastOnlineUsers();
  });
};

export default init;
