import redisClient from "../config/redisClient.js";

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

        const isAlreadyOnline = await redisClient.hExists(
          "online_users",
          userName
        );
        if (!isAlreadyOnline) {
          await redisClient.hSet("online_users", userName, socket.id);
          console.log(`${userName} registered with ID ${socket.id}`);
        } else {
          console.log(`${userName} already online`);
        }

        const queuedMessages = await redisClient.lRange(
          getQueueKey(userName),
          0,
          -1
        );

        if (queuedMessages.length > 0) {
          queuedMessages.forEach((msg) => {
            io.to(socket.id).emit("receive_message", JSON.parse(msg));
          });

          await redisClient.del(getQueueKey(userName));
        }

        await broadcastOnlineUsers();
      } catch (err) {
        console.error("Error in register:", err.message);
      }
    });

    socket.on("private_message", async ({ to, content }) => {
      try {
        const targetSocketId = await redisClient.hGet("online_users", to);
        const messagePayload = {
          from: socket.username,
          content,
          timestamp: new Date().toISOString(),
        };

        if (targetSocketId) {
          io.to(targetSocketId).emit("receive_message", messagePayload);
        } else {
          console.log(`User "${to}" is not online.`);
          await redisClient.rPush(
            getQueueKey(to),
            JSON.stringify(messagePayload)
          );
        }
      } catch (err) {
        console.error("Error in private_message:", err.message);
      }
    });

    socket.on("typing", async ({ to }) => {
      try {
        const targetSocketId = await redisClient.hGet("online_users", to);
        if (targetSocketId) {
          io.to(targetSocketId).emit("typing", { from: socket.username });
        }
      } catch (err) {
        console.error("Error in typing:", err.message);
      }
    });

    socket.on("stop_typing", async ({ to }) => {
      try {
        const targetSocketId = await redisClient.hGet("online_users", to);
        if (targetSocketId) {
          io.to(targetSocketId).emit("stop_typing", { from: socket.username });
        }
      } catch (err) {
        console.error("Error in stop_typing:", err.message);
      }
    });

    socket.on("manual_logout", async () => {
      try {
        if (socket.username) {
          await redisClient.hDel("online_users", socket.username);
          console.log(`${socket.username} logged out manually`);
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
