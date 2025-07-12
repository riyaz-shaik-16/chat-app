import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

messageSchema.statics.createAndPopulate = async function ({
  conversationId,
  senderId,
  receiverId,
  content,
  type = "text",
  status = "sent",
}) {
  const message = await this.create({
    conversationId,
    senderId,
    receiverId,
    content: content.trim(),
    type,
    status,
  });

  return this.findById(message._id)
    .populate("senderId", "_id fullName picture")
    .populate("receiverId", "_id fullName picture");
};

export default mongoose.model("Message", messageSchema);


