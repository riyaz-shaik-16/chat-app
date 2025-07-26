import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import { redisClient } from "../index.js";
import User from "../models/user.model.js";

// loginUser
export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
      res.status(429).json({
        message: "Too may requests. Please wait before requesting new opt",
      });
      return;
    }

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
      subject: "Your otp code",
      body: `Your OTP is ${otp}. It is valid for 5 minutes`,
    };

    await publishToQueue("send-otp", message);

    res.status(200).json({
      message: "OTP sent to your mail",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verifyUser
export const verifyUser = async (req, res) => {
  try {
    console.log("In verify user:");
    console.log("Req body: ",req?.body);
    const { email, otp: enteredOtp } = req.body;

    console.log("Email and otp: ",email,enteredOtp);

    if (!email || !enteredOtp) {
      res.status(400).json({
        message: "Email and OTP Required",
      });
      return;

      
    }
    console.log("Getting otp from redis")

    const otpKey = `otp:${email}`;

    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== enteredOtp) {
      res.status(400).json({
        message: "Invalid or expired OTP",
      });
      return;
    }

    console.log("OTP verified!");

    await redisClient.del(otpKey);

    let user = await User.findOne({ email });

    console.log("USer: ",user);

    if (!user) {
      const name = email.slice(0, 8);
      user = await User.create({ name, email });
    }

    const token = generateToken(user);

    res.json({
      message: "User Verified",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// myProfile
export const myProfile = async (req, res) => {
  console.log("🎯 === CONTROLLER STARTED ===");
  console.log("📝 In my profile controller!");
  
  try {
    console.log("👤 Req user: ", req?.user);
    const user = req.user;
    
    console.log("📤 Sending response with user data");
    res.json(user);
    
  } catch (error) {
    console.log("💥 Error in my profile controller: ", error);
    res.status(500).json({ message: error.message });
  }
};

// updateName
export const updateName = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({
        message: "Please login",
      });
      return;
    }

    user.name = req.body.name;

    await user.save();

    const token = generateToken(user);

    res.json({
      message: "User Updated",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getAllUsers
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getAUser
export const getAUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
