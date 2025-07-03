import User from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Conversation from "../models/conversation.model.js";

export const loginSuccess = asyncHandler(async (req, res, next) => {
  const user = {
    id: req.user.id,
    name: req.user.displayName,
    email: req.user.emails[0].value,
    picture: req.user.photos[0].value,
  };

  const savedUser = await User.findOneAndUpdate(
    { email: user.email },
    {
      fullName: user.name,
      picture: user.picture,
    },
    { upsert: true, new: true }
  );

  if (!savedUser) {
    throw new ApiError(500, "Failed to save user");
  }

  const token = savedUser.generateJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60,
  });

  res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
});

export const getProfile = (req, res) => {
  // console.log("Req user: ",req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logged out successfully"));
};

export const getAllUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const users = await User.find({ _id: { $ne: currentUserId } }).lean();

  const conversations = await Conversation.find({
    participants: currentUserId,
  }).lean();

  const conversationMap = {};
  for (const convo of conversations) {
    const otherUserId = convo.participants.find(
      (id) => id.toString() !== currentUserId.toString()
    );

    if (otherUserId) {
      conversationMap[otherUserId.toString()] = {
        lastMessage: convo.lastMessage || null,
        unreadCount: convo.unreadCounts?.[currentUserId.toString()] || 0,
        _id: convo._id,
      };
    }
  }

  const usersWithMeta = users.map((user) => {
    const convo = conversationMap[user._id.toString()] || {};
    return {
      ...user,
      lastMessage: convo.lastMessage || null,
      unreadCount: convo.unreadCount || 0,
      conversationId: convo._id || null,
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        usersWithMeta,
        "Users with lastMessage and unreadCount"
      )
    );
});
