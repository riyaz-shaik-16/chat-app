import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please Login - No Auth header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    let decodedValue;
    try {
      decodedValue = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    req.user = decodedValue.user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Please Login - JWT error",
    });
  }
};

