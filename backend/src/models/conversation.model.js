import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      content: { type: String, default: "" },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      type: {
        type: String,
        enum: ["text", "image", "video", "file"],
        default: "text",
      },
      timestamp: {
        type: Date,
        default: null,
      },
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ participants: 1 });

export default mongoose.model("Conversation", conversationSchema);
