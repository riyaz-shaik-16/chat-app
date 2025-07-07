import express from "express";
import { createChat, getAllChats } from "../controllers/chat.controller.js";
import verify from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/create-chat",verify,createChat);
router.get("/get-all-chats",verify,getAllChats);

export default router;