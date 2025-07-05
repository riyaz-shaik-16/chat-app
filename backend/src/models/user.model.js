import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    picture: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, 
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    hasPassword: {
      type: Boolean,
      default: false, 
    },
    passwordUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

//for hashing the password before saving

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

//jwt generation here..

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      issuer: process.env.JWT_ISSUER || "chat-app",
    }
  );
};

//function to update last login

userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

//function to compare password

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  console.log("This password: ",this.password);
  return await bcrypt.compare(candidatePassword,this.password);
};

//function to set new password

userSchema.methods.setPassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(newPassword, salt);
  this.hasPassword = true;
  this.passwordUpdatedAt = new Date();
  await this.save();
};


//function to check wether the user can login through password

userSchema.methods.canLoginWithPassword = function () {
  return this.hasPassword && !!this.password;
};

//for creating a user

userSchema.statics.findOrCreate = async function (profile) {
  let user = await this.findOne({
    $or: [
      { googleId: profile.id },
      { email: profile.emails?.[0]?.value },
    ],
  });

  if (!user) {
    user = await this.create({
      googleId: profile.id,
      fullName: profile.displayName,
      email: profile.emails?.[0]?.value,
      picture: profile.photos?.[0]?.value || "",
    });
  } 

  return user;
};

export default mongoose.model("User", userSchema);
