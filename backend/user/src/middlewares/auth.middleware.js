import jwt from "jsonwebtoken";

// Remove 'async' - this might be the issue!
export const isAuth = (req, res, next) => {
  console.log("🔍 === AUTH MIDDLEWARE STARTED ===");
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please Login - No auth header",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedValue = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedValue || !decodedValue.user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = decodedValue.user;
    console.log("✅ About to call next()");
    
    next();
    
    console.log("✅ next() called - middleware complete");
    
  } catch (error) {
    console.log("💥 Error in middleware: ", error);
    return res.status(401).json({
      message: "Please Login - JWT error",
    });
  }
};