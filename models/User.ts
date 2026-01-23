import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String }, 
  image: { type: String },
  phone: { type: String }, // ✅ Added Phone Number
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;