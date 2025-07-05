import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import redisClient from "../config/redisClient.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const redisUser = await redisClient.get(`user:${decoded.email}`);

  if (redisUser) {
    req.user = JSON.parse(redisUser);
    return next();
  }

  const user = await User.findOne({ email: decoded.email }).select(
    "-password -__v -googleId"
  );

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  await redisClient.set(`user:${decoded.email}`, JSON.stringify(user), {
    EX: 60 * 5,
  });

  req.user = user;
  return next();
});

export default verifyJWT;
