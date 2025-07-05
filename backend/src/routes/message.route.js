import express from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-message", sendMessage);
router.get("/get-messages/:id", verifyJWT, getMessages);

export default router;
