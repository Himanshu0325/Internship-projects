import mongoose from "mongoose";
import bcrypt from "bcrypt"

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
    profileImg:{
      type:String,
    }
  },
  {
    timestamps: true,
  }
)

userSchema.index({ fullName: 'text' });

userSchema.pre("save", async function (next)  {

  if( !this.isModified("password")) {
    return next()
  } else{
    this.password = await bcrypt.hash(this.password,10)
  }
  next()
})

userSchema.methods.isPasswordCorrect = async function (password){
  console.log(await bcrypt.compare(password , this.password),"bycrpt value");
  
  return await bcrypt.compare(password , this.password)
}

export const User = mongoose.model("User", userSchema);
