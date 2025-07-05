import User from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Conversation from "../models/conversation.model.js";

export const loginSuccess = asyncHandler(async (req, res) => {
  // console.log("User came from google: ", req.user);
  if (!req.user) throw new ApiError(400, "OAuth login failed");

  const savedUser = await User.findOrCreate(req.user);

  if (!savedUser) throw new ApiError(500, "Failed to process user");

  const token = savedUser.generateJWT();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  if (savedUser.hasPassword) {
    console.log("Redirected to profile!")
    res.redirect(`${process.env.FRONTEND_URL}/profile`);
    return;
  }

  res.redirect(`${process.env.FRONTEND_URL}/set-password`);
});

export const setPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword || password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password doesn't match");
  }

  const user = req.user;
  console.log("User: ", user);
  if (!user) throw new ApiError(401, "User not authenticated");

  console.log("has password: ", user.hasPassword);

  if (user.hasPassword) {
    throw new ApiError(
      400,
      "Password already set. Use reset password instead."
    );
  }

  const mongoUser = await User.findOne({ email: user.email }).select(
    "-password -__v -googleId"
  );

  await mongoUser.setPassword(password);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password successfully set!"));
});

export const getProfile = (req, res) => {
  // console.log("Req user: ",req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
};

export const login = asyncHandler(async(req,res) => {
  const {email,password} = req.body;

  const user = await User.findOne({email:email});

  if(!user){
    throw new ApiError(400,"No user found with that email");
  }
  
  if(!user.canLoginWithPassword()){
    throw new ApiError(400,"You cant login with password right now!\nUse google login instead");
  }

  const valid = await user.comparePassword(password);

  console.log("valid password: ",valid);

  if(!valid){
    throw new ApiError(400,"Incorrect password");  
  }

  const token = user.generateJWT();

  console.log("Token generated!");

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  return res.status(200).json(new ApiResponse(200,user,"Logged in Successfully!"))
})

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
