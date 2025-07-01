import express from "express";
import passport from "passport";
import { loginSuccess, getProfile, logout, getAllUsers } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));


router.get("/google/callback", 
  passport.authenticate("google", { session: false }),
  loginSuccess
);

router.get("/profile",verifyJWT, getProfile);
router.post("/logout",verifyJWT,logout);
router.get("/getUsers",verifyJWT,getAllUsers)

export default router;
