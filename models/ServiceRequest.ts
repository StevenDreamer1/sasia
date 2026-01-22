import mongoose, { Schema, models } from "mongoose"

/* ---------------- MESSAGE SCHEMA ---------------- */

const MessageSchema = new Schema(
  {
    sender: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false, // unread by default
    },

    // ✅ REACTIONS (NEW – SAFE ADDITION)
    reactions: [
      {
        emoji: {
          type: String,
          required: true,
        },
        by: {
          type: String,
          enum: ["user", "admin"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

/* ---------------- SERVICE REQUEST SCHEMA ---------------- */

const ServiceRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 faster user queries
    },
    serviceType: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
      index: true, // 🔥 admin filtering
    },
    messages: {
      type: [MessageSchema],
      default: [], // ✅ old messages stay valid
    },
  },
  { timestamps: true }
)

/* ---------------- INDEXES ---------------- */

// 🚀 PERFORMANCE INDEXES
ServiceRequestSchema.index({ userId: 1 })
ServiceRequestSchema.index({ status: 1 })
ServiceRequestSchema.index({ createdAt: -1 })

// 💬 CHAT-SPECIFIC INDEXES
ServiceRequestSchema.index({ "messages.sender": 1 })
ServiceRequestSchema.index({ "messages.seen": 1 })
ServiceRequestSchema.index({ "messages.createdAt": -1 })

/* ---------------- EXPORT ---------------- */

export default models.ServiceRequest ||
  mongoose.model("ServiceRequest", ServiceRequestSchema)
