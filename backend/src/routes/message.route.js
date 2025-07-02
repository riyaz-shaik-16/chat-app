import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-message", verifyJWT, sendMessage);
router.get("/get-messages/:otherUserId", verifyJWT, getMessages);

export default router;
