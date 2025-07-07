import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import axios from "axios";

export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.body;

    console.log("userID: ", userId);
    console.log("Otheruser id: ", otherUserId);

    if (!otherUserId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid otheruserId!",
      });
    }

    let chat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (chat && chat.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Chat already Exists!",
        chat: existingChat,
      });
    }

    chat = await Chat.create({ users: [userId, otherUserId] });

    return res.status(201).json({
      success: true,
      message: "Chat Created Successfully!",
      chat,
    });
  } catch (error) {
    console.log("Error in create chat: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid UserId",
      });
    }

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatwithUserData = await Promise.all(
      chats.map(async (chat) => {
        const otherUserId = chat.users.find((id) => id !== userId);
        const unseenCount = await Message.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          seen: false,
        });

        try {
          const {data} = await axios.get(
            `${process.env.USERSERVICE_URL}/api/user/get-user/${otherUserId}`
          );
          return {
            user:data.user,
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };
        } catch (error) {
          console.log("Error in chat with user data: ", error);
          return {
            user: {
              _id: otherUserId,
              name: "Unknown User",
              email: "Unknown email",
            },
            chat: {
              ...chat.toObject(),
              latestMessage: chat.latestMessage || null,
              unseenCount,
            },
          };
        }
      })
    );

    return res.status(200).json({
        success:true,
        message:"All Chats Fetched Successfully",
        chats:chatwithUserData
    })
  } catch (error) {
    console.log("Error in get all chats: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

