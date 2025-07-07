import express from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verify from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-message",verify,
    upload.fields([
      { name: "image", maxCount: 1 }
    ]),sendMessage)

export default router;