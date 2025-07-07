import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  try {

    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");


    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Session Expired! Please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
        _id:decoded._id,
        email:decoded.email
    };
    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default verifyJwt;