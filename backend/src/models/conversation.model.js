import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (v) {
          return v && v.length === 2;
        },
        message: "Direct conversation must have exactly 2 participants",
      },
    },

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
      default: new Map(),
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    archivedBy: {
      type: Map,
      of: Boolean,
      default: new Map(),
    },

    pinnedBy: {
      type: Map,
      of: Boolean,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ "lastMessage.timestamp": -1 });
conversationSchema.index({ isActive: 1 });


//to update last message
conversationSchema.methods.updateLastMessage = function (messageData) {
  this.lastMessage = {
    content: messageData.content,
    senderId: messageData.senderId,
    type: messageData.type,
    timestamp: new Date(),
  };
  return this.save();
};

//to increment unread countt
conversationSchema.methods.incrementUnreadCount = function (userId) {
  const currentCount = this.unreadCounts.get(userId.toString()) || 0;
  this.unreadCounts.set(userId.toString(), currentCount + 1);
  return this.save();
};

//to reset unread countttttt
conversationSchema.methods.resetUnreadCount = function (userId) {
  this.unreadCounts.set(userId.toString(), 0);
  return this.save();
};

//to check if the given is part of a convo or not
conversationSchema.methods.isParticipant = function (userId) {
  return this.participants.some(
    (participant) => participant.toString() === userId.toString()
  );
};


// find all convos that includes the given user
conversationSchema.statics.findByParticipant = function (userId) {
  return this.find({
    participants: userId,
    isActive: true,
  }).sort({ "lastMessage.timestamp": -1 });
};

//find direct convo between two users
conversationSchema.statics.findDirectConversation = function (
  userId1,
  userId2
) {
  return this.findOne({
    participants: { $all: [userId1, userId2] },
    isActive: true,
  });
};


// to create a direct convo between two users
conversationSchema.statics.createDirectConversation = function (
  userId1,
  userId2
) {
  const unreadCounts = new Map();
  unreadCounts.set(userId1.toString(), 0);
  unreadCounts.set(userId2.toString(), 0);

  return this.create({
    participants: [userId1, userId2],
    unreadCounts: unreadCounts,
  });
};

// Pre-save hook
conversationSchema.pre("save", function (next) {
  this.participants.forEach((participantId) => {
    if (!this.unreadCounts.has(participantId.toString())) {
      this.unreadCounts.set(participantId.toString(), 0);
    }
  });

  next();
});

export default mongoose.model("Conversation", conversationSchema);
