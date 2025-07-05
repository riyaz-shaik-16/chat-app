import express from "express"
import { getSidebarUsers } from "../controllers/chat.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js"

const router = express.Router()

router.get("/users",verifyJWT,getSidebarUsers)

export default router;