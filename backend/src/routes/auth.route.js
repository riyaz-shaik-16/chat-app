import express from "express";
import passport from "passport";
import { loginSuccess, getProfile, logout, getAllUsers, setPassword, login } from "../controllers/auth.controller.js";
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
router.post("/login",login)
router.post("/logout",verifyJWT,logout);
router.post("/set-password",verifyJWT,setPassword);
router.get("/getUsers",verifyJWT,getAllUsers)

export default router;
