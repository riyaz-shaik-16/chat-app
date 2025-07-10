import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  try {

    console.log("this hit!");
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

      console.log("Token: ",token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Session Expired! Please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded: ",decoded);

    const user = await User.findOne({ email: decoded.email });

    if (!user || user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid token!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
