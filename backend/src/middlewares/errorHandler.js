import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {

  // for known errors
  if (err instanceof ApiError) {
    console.log("Known error: ",err.message);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
      errors: err.errors || [],
      data: err.data || null,
    });
  }

  console.error("🔥 Unhandled Error:", err);


  // for unknown erorssssss
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [err.message],
    data: null,
  });
};

export default errorHandler;
