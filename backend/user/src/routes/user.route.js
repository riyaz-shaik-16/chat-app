import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { login, verifyUser, getProfile, logout, getAllUsers, getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/verify-user", verifyUser);
router.get("/get-profile",verifyJwt,getProfile)
router.post("/logout",verifyJwt,logout);
router.get("/get-users",getAllUsers)
router.get("/get-user/:id",getUser)

export default router;
