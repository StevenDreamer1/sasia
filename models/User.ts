import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
})

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: {
      type: String,
      default: "user",
    },

    // ✅ Added notifications here
    notifications: {
      type: [NotificationSchema],
      default: [],
    },
  },
  { timestamps: true }
)

export default mongoose.models.User ||
  mongoose.model("User", UserSchema)
