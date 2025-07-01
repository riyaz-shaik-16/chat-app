import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

  // console.log("saved user: ",savedUser)
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
  // console.log(req.user._id);
  const users = await User.find({ _id: { $ne: req.user?._id } });
  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users Fetched Successfully!"));
});
