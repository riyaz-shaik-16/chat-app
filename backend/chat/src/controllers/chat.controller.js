import axios from "axios";
import { Chat } from "../models/chat.model.js";
import { Messages } from "../models/message.model.js";
import { getRecieverSocketId, io } from "../config/socket.js";

export const createNewChat = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "Other userid is required",
      });
      return;
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      res.json({
        message: "Chat already exitst",
        chatId: existingChat._id,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    res.status(201).json({
      message: "New Chat created",
      chatId: newChat._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(400).json({
        message: " UserId missing",
      });
      return;
    }

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    console.log("All chats: ",chats);

    const chatWithUserData = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
        console.log("Otheruserid: ",otherUserId);

        const unseenCount = await Messages.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          seen: false,
        });

        try {
          const { data } = await axios.get(
            `${process.env.USERSERVICE_URL}/api/v1/user/${otherUserId}`
          );

          console.log("data in get all chats: ",data);
          return {
            user: data,
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            user: { _id: otherUserId, name: "Unknown User" },
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };
        }
      })
    );

    res.json({
      chats: chatWithUserData,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;

    if (!senderId) {
      res.status(401).json({
        message: "unauthorized",
      });
      return;
    }
    if (!chatId) {
      res.status(400).json({
        message: "ChatId Required",
      });
      return;
    }

    if (!text && !imageFile) {
      res.status(400).json({
        message: "Either text or image is required",
      });
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({
        message: "Chat not found",
      });
      return;
    }

    const isUserInChat = chat.users.some(
      (userId) => userId.toString() === senderId.toString()
    );

    if (!isUserInChat) {
      res.status(403).json({
        message: "You are not a participant of this chat",
      });
      return;
    }

    const otherUserId = chat.users.find(
      (userId) => userId.toString() !== senderId.toString()
    );

    if (!otherUserId) {
      res.status(401).json({
        message: "No other user",
      });
      return;
    }

    //socket setup
    const receiverSocketId = getRecieverSocketId(otherUserId.toString());
    let isReceiverInChatRoom = false;

    if (receiverSocketId) {
      const receiverSocket = io.sockets.sockets.get(receiverSocketId);
      if (receiverSocket && receiverSocket.rooms.has(chatId)) {
        isReceiverInChatRoom = true;
      }
    }

    let messageData = {
      chatId: chatId,
      sender: senderId,
      seen: isReceiverInChatRoom,
      seenAt: isReceiverInChatRoom ? new Date() : undefined,
    };

    if (imageFile) {
      messageData.image = {
        url: imageFile.path,
        publicId: imageFile.filename,
      };
      messageData.messageType = "image";
      messageData.text = text || "";
    } else {
      messageData.text = text;
      messageData.messageType = "text";
    }

    const message = new Messages(messageData);

    const savedMessage = await message.save();

    const latestMessageText = imageFile ? "📷 Image" : text;

    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: {
          text: latestMessageText,
          sender: senderId,
        },
        updatedAt: new Date(),
      },
      { new: true }
    );

    //emit to sockets
    io.to(chatId).emit("newMessage", savedMessage);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", savedMessage);
    }

    const senderSocketId = getRecieverSocketId(senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", savedMessage);
    }

    if (isReceiverInChatRoom && senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", {
        chatId: chatId,
        seenBy: otherUserId,
        messageIds: [savedMessage._id],
      });
    }

    res.status(201).json({
      message: savedMessage,
      sender: senderId,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getMessagesByChat = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!chatId) {
      res.status(400).json({
        message: "ChatId Required",
      });
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      res.status(404).json({
        message: "Chat not found",
      });
      return;
    }

    const isUserInChat = chat.users.some(
      (userIdInChat) => userIdInChat.toString() === userId.toString()
    );

    if (!isUserInChat) {
      res.status(403).json({
        message: "You are not a participant of this chat",
      });
      return;
    }

    const messagesToMarkSeen = await Messages.find({
      chatId: chatId,
      sender: { $ne: userId },
      seen: false,
    });

    await Messages.updateMany(
      {
        chatId: chatId,
        sender: { $ne: userId },
        seen: false,
      },
      {
        seen: true,
        seenAt: new Date(),
      }
    );

    const messages = await Messages.find({ chatId }).sort({ createdAt: 1 });

    const otherUserId = chat.users.find((id) => id !== userId);

    try {
      const { data } = await axios.get(
        `${process.env.USERSERVICE_URL}/api/v1/user/${otherUserId}`
      );

      if (!otherUserId) {
        res.status(400).json({
          message: "No other user",
        });
        return;
      }

      //socket work
      if (messagesToMarkSeen.length > 0) {
        const otherUserSocketId = getRecieverSocketId(otherUserId.toString());
        if (otherUserSocketId) {
          io.to(otherUserSocketId).emit("messagesSeen", {
            chatId: chatId,
            seenBy: userId,
            messageIds: messagesToMarkSeen.map((msg) => msg._id),
          });
        }
      }

      res.json({
        messages,
        user: data,
      });
    } catch (error) {
      console.log(error);
      res.json({
        messages,
        user: { _id: otherUserId, name: "Unknown User" },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
