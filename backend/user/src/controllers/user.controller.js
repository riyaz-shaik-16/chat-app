import { redisClient } from "../config/redisClient.js";
import { publishToQueue } from "../config/rabbitMQ.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    console.log("REQ body: ",req?.body);
    const { email } = req.body;

    

    if (!email)
      return res.status(400).json({
        success: false,
        message: "Email required!",
      });

    const rateLimitKey = `otp:ratelimit:${email}`;

    const rateLimit = await redisClient.get(rateLimitKey);

    if (rateLimit)
      return res.status(429).json({
        sucsess: true,
        message: "Please wait for a sec!",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, otp, {
      EX: 300,
    });

    await redisClient.set(rateLimitKey, "true", {
      EX: 60,
    });

    const message = {
      to: email,
      subject: "Your Otp",
      body: `Use this: ${otp}. This otp is valid for next 5min.`,
    };

    await publishToQueue("send-otp", message);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.log("Error in login: ", error);
    return res.status(500).json({
      success: true,
      message: "Internal Server Error!",
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("REQ body: ",req?.body);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields required!",
      });
    }

    const otpKey = `otp:${email}`;

    const originalOtp = await redisClient.get(otpKey);

    if (!originalOtp || originalOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }

    await redisClient.del(otpKey);

    let user = await User.findOne({ email });

    if (!user || user.length === 0) {
      user = await User.create({ name: email.slice(0, 8), email });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.DEVELOPMENT_ENVIRONMENT === "PRODUCTION",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user,
    });
  } catch (error) {
    console.log("Error in login: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile Fetched Successfully!",
    user: req.user,
  });
};

export const logout = (req, res) => {
  if (req.user) {
    res.clearCookie("token");
    delete req.user;
    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      users,
    });
  } catch (error) {
    console.log("Error in get users: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user || user.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }
    return res.status(200).json({
      success: true,
      messages: "Fetched user data successfully!",
      user,
    });
  } catch (error) {
    console.log("Error in get user: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

