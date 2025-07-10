import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName:{
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken:{
      type:String
    },
    accessToken:{
      type:String
    },
    status:{
      type:Boolean,
      default:false
    },
    isVerified:{
      type:Boolean,
      default:false
    },
  },
  {
    timestamps: true,
  }
)

userSchema.index({ fullName: 'text' });

export const User = mongoose.model("User", userSchema);