import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const image = req.files?.image?.[0];

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Invalid senderId",
      });
    }

    if (!chatId) {
      return res.status(401).json({
        success: false,
        message: "Invalid chatId",
      });
    }

    if (!text && !image) {
      return res.status(401).json({
        success: false,
        message: "Text or Image is required!",
      });
    }

    let imageUrl = "";
    let publicId = "";
    if (image) {
      const localFilePath = image?.path;
      const uploadResult = await uploadOnCloudinary(localFilePath);
      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.publicId;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(401).json({
        success: false,
        message: "No chat found for given chatId",
      });
    }

    const isUserInChat = chat.users.some(
      (userId) => userId.toString() === senderId.toString()
    );

    if (!isUserInChat) {
      return res.status(403).json({
        success: false,
        message: "User is not in Chat!",
      });
    }

    const otherUserId = chat.users.find(
      (userId) => userId.toString() !== senderId.toString()
    );

    if (!otherUserId) {
      return res.status(401).json({
        success: false,
        message: "No other user found!",
      });
    }

    //to-do
    //socket integration

    let message = {
      chatId: chatId,
      sender: senderId,
      seen: false,
    };

    if (image) {
      message.image = {
        url: imageUrl,
        publicId,
      };
      (message.messageType = "image"), (message.text = text || "");
    } else {
      (message.text = text), (message.messageType = "text");
    }

    const createdMessage = await Message.create(message);

    await createdMessage.save();

    const latestMessageText = image ? "📷 Image" : text;

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: {
        text: latestMessageText,
        sender: senderId,
      },
      updatedAt: new Date(),
    });

    //socket to do

    return res.status(200).json({
      success: true,
      message: "Message Sent Successfully",
      createdMessage,
    });
  } catch (error) {
    console.log("Error in send message: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};
